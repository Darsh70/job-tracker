from flask import Flask, request, jsonify
from flask_cors import CORS
from scraper import process_job_url
from sql_storage import update_job_status
import sqlite3
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

DB_FILE = "tracker.db"

# To create and load the database
def read_jobs_from_db():
    try: 
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory= sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM jobs")
        rows = cursor.fetchall()

        jobs = []
        for row in rows:
            job = {
                'id': row['id'],
                'title': row['job_title'],
                'company': row['company_name'],
                'location': row['location'],
                'link': row['job_link'],
                'date': row['date_applied'],
                'status': row['status'],
                'description': row['job_description']
            }
            jobs.append(job)
        return jobs
    except sqlite3.Error as e:
        print(f"Database Error,{e}")
        return []
    finally:
        if conn:
            conn.close()


@app.route('/getJobs', methods=['GET'])
def get_jobs():
    try:
        jobs = read_jobs_from_db()
        return jsonify(jobs)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Send job to scraper
@app.route('/submitJob', methods=['POST'])
def submit_job():
    try:
        url = request.json.get('url')
        if not url:
            return jsonify({'error': 'URL is required'}), 400
            
        job_data = process_job_url(url)
        if not job_data:
            return jsonify({'error': 'Failed to process job URL'}), 400
            
        return jsonify(job_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Update status when changes are made in the frontend
@app.route('/updateStatus', methods=['POST'])
def update_status():
    try:
        data = request.json
        job_url = data.get('url')
        new_status = data.get('status')

        if not all([job_url, new_status]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        success = update_job_status(job_url, new_status)

        if not success:
            return jsonify({'error': 'Job not found'}), 404
        else:
            return jsonify({'message': 'Job updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
        
@app.route('/deleteJobs', methods=['POST'])
def deleteJobs():
    try:
        data =request.json
        job_ids = data.get('ids')

        if not job_ids:
            return jsonify({'error': 'No Job IDs provided'}), 400

        with sqlite3.connect(DB_FILE) as conn:
            cursor = conn.cursor()
            id_placeholders = ",".join(["?"] * len(job_ids))
            query = f'DELETE FROM jobs WHERE id IN ({id_placeholders})'
            cursor.execute(query, job_ids)
            conn.commit()
            
        return jsonify({'message': 'Jobs deleted'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# Get job counts for analytics
@app.route('/getJobCounts', methods=['GET'])
def get_job_counts():
    counts = {
        'total': 0,
        'applied': 0,
        'interviewing': 0,
        'rejected': 0,
        'offer': 0
    }

    try:
        with sqlite3.connect(DB_FILE) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()

            cursor.execute('SELECT COUNT(*) as total_count FROM jobs')
            total_result = cursor.fetchone()
            if total_result:
                counts['total'] = total_result['total_count']
            
            cursor.execute("SELECT status, COUNT(*) as status_count FROM jobs GROUP BY status")
            status_results = cursor.fetchall()

            for row in status_results:
                status_key = row['status'].lower()

                if status_key in counts:
                    counts[status_key] = row['status_count']
            
            return jsonify(counts)

    except sqlite3.Error as e:
        print(f"Database error fetching counts: {e}") 
        return jsonify({'error': f'Database error: {e}'}), 500
    except Exception as e:
        print(f"Unexpected error fetching counts: {e}") 
        return jsonify({'error': 'An unexpected server error occurred'}), 500



@app.route('/applicationsByDate', methods=['GET'])
def applications_by_date():
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT date_applied, COUNT(*) FROM jobs
            GROUP BY date_applied
            ORDER BY date_applied
        """)
        data = cursor.fetchall()

    # Convert to dictionary for easier lookup
    date_counts = {row[0]: row[1] for row in data}

    # Find range
    start_date = datetime.strptime(data[0][0], '%Y-%m-%d')
    end_date = datetime.today()

    full_data = []
    current_date = start_date
    while current_date <= end_date:
        date_str = current_date.strftime('%Y-%m-%d')
        count = date_counts.get(date_str, 0)
        full_data.append({
            "date": date_str,
            "count": count
        })
        current_date += timedelta(days=1)

    return jsonify(full_data)


if __name__ == '__main__':
    app.run(debug=True, port=5001)

