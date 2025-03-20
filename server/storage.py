import csv
import os
from datetime import date

csv_file = "tracker.csv"

def store_job(job_title, company_name, location, job_description, job_link):
    file_exists = os.path.exists(csv_file)

    field_names = ["Job Title", "Company Name", "Location", "Job Link", "Date Applied", "Status", "Job Description"]
    
    with open(csv_file, "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=field_names)
        if not file_exists:
            writer.writeheader()
        writer.writerow({
            "Job Title": job_title,
            "Company Name": company_name,
            "Location": location,
            "Job Link": job_link,
            "Date Applied": date.today(),
            "Status": "Applied",
            "Job Description": job_description
        })
    print("Job saved!")

def update_job_status(job, company, date_applied, status):
    jobs = []
    field_names = ["Job Title", "Company Name", "Location", "Job Link", "Date Applied", "Status", "Job Description"]
    
    if not os.path.exists(csv_file):
        return False
        
    with open(csv_file, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            jobs.append(row)
            # Update the specific job
            if (row["Job Title"] == job and row["Company Name"] == company and row["Date Applied"] == date_applied):
                row["Status"] = status
    
    with open(csv_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=field_names)
        writer.writeheader()
        writer.writerows(jobs)
    print("Job updated!")
    return True