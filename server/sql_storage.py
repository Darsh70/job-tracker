import sqlite3
from datetime import date

db_file = "tracker.db"

import sqlite3
from datetime import date

db_file = "tracker.db"

def create_table():
    with sqlite3.connect(db_file) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS jobs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                job_title TEXT,
                company_name TEXT,
                location TEXT,
                job_link TEXT UNIQUE,
                date_applied TEXT,
                status TEXT,
                job_description TEXT
            )
        """)
        conn.commit()

create_table()

def store_job(job_title, company_name, location, job_link, job_description):
    try:
        with sqlite3.connect(db_file) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO jobs(job_title, company_name, location, job_link, date_applied, status, job_description)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (job_title, company_name, location, job_link, date.today(), "Applied", job_description))
            conn.commit()
            print("Job saved to SQLite")
    except sqlite3.IntegrityError:
        print("Job already exists")

def update_job_status(job_link, new_status):
    with sqlite3.connect(db_file) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE jobs
            SET status = ?
            WHERE job_link = ?
        """, (new_status, job_link))
        conn.commit()

        if cursor.rowcount > 0:
            print("Status updated")
            return True
        else:
            print("Failed to update status")
            return False
