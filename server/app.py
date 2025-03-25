from flask import Flask, request, jsonify
from flask_cors import CORS
from scraper import process_job_url
from sql_storage import update_job_status
import sqlite3

app = Flask(__name__)
CORS(app)

DB_FILE = "tracker.db"

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
        


if __name__ == '__main__':
    app.run(debug=True, port=5001)

