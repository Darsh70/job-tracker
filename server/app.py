from flask import Flask, request, jsonify
from flask_cors import CORS
from scraper import process_job_url
from storage import update_job_status
import csv
import os

app = Flask(__name__)
CORS(app)

CSV_FILE = "tracker.csv"

def read_jobs_from_csv():
    if not os.path.exists(CSV_FILE):
        return []
    
    jobs = []
    with open(CSV_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            jobs.append({
                'title': row['Job Title'],
                'company': row['Company Name'],
                'location': row['Location'],
                'link': row['Job Link'],
                'date': row['Date Applied'],
                'status': row['Status'],
                'description': row['Job Description']
            })
    return jobs

@app.route('/getJobs', methods=['GET'])
def get_jobs():
    try:
        jobs = read_jobs_from_csv()
        return jsonify(jobs)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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
    
@app.route('/updateStatus', methods=['POST'])
def update_status():
    try:
        data = request.json

        title = data.get('title')
        company = data.get('company')
        date = data.get('date')
        new_status = data.get('status')

        if not all([title, company, date, new_status]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        success = update_job_status(title, company, date, new_status)

        if not success:
            return jsonify({'error': 'Job not found'}), 404
        else:
            return jsonify({'message': 'Job updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
        


if __name__ == '__main__':
    app.run(debug=True, port=5001)

