import requests
from bs4 import BeautifulSoup
import re
from storage import store_job
from datetime import date
from urllib.parse import urlparse

def clean_text(text):
    return "N/A" if not text else re.sub(r'\s+', ' ', text.strip())

def scrape_linkedIn(url):
    # Extract job ID and normalize URL
    if "currentJobId" in url:
        job_id = re.search(r'currentJobId=(\d+)', url).group(1)
    elif "view" in url:
        job_id = url.split('view/')[-1].split('/')[0]
    else:
        job_id = None
    
    if job_id:
        url = f"https://www.linkedin.com/jobs/view/{job_id}/"
    
    # Fetch and parse the page
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")
    
  
    title_text = soup.title.text if soup.title else None
    match = re.search(r'(.+) hiring (.+) in (.+) \| LinkedIn', title_text)
    
    if match:
        company_name, job_title, location = match.groups()
    else:
        job_title = clean_text(soup.find("h1", class_="top-card-layout__title").text if soup.find("h1", class_="top-card-layout__title") else None)
        company_name = clean_text(soup.find("a", class_="topcard__org-name-link").text if soup.find("a", class_="topcard__org-name-link") else None)
        location = clean_text(soup.find("span", class_="topcard__flavor--bullet").text if soup.find("span", class_="topcard__flavor--bullet") else None)
    

    job_title = clean_text(job_title)
    company_name = clean_text(company_name)
    location = clean_text(location)
    

    desc_div = soup.find("div", class_="show-more-less-html__markup")
    job_description = clean_text(desc_div.text) if desc_div else "N/A"
    
    return job_title, company_name, location, job_description, url

def scrape_greenhouse(url):
    
    response = requests.get(url)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")
    
    job_title = clean_text(soup.find("h1", class_="section-header").text if soup.find("h1", class_="section-header") else None)
    company_name = urlparse(url).path.split("/")[1]
    location = clean_text(soup.find("div", class_="job__location").text if soup.find("div", class_="job__location") else None)

    desc_div = soup.find("div", class_="job__description")
    job_description = clean_text(desc_div.text) if desc_div else "N/A"
    print(location)

    return job_title, company_name, location, job_description

def process_job_url(url):
    if not url:
        raise ValueError("URL is required")
        
    # Normalize URL
    url = url.strip()
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url

    try:
        if "linkedin.com" in url:
            job_title, company_name, location, job_description, url = scrape_linkedIn(url)
        elif "greenhouse.io" in url:
            job_title, company_name, location, job_description = scrape_greenhouse(url)
        else:
            raise ValueError("Unsupported job board. Currently supporting LinkedIn and Greenhouse only.")
            
        if job_title == "N/A" or company_name == "N/A":
            raise ValueError("Failed to extract essential job information")
            
        store_job(job_title, company_name, location, job_description, url)
        
        return {
            "title": job_title,
            "company": company_name,
            "location": location,
            "link": url,
            "date": str(date.today()),
            "status": "Applied",
            "description": job_description
        }
    except Exception as e:
        raise Exception(f"Error processing job URL: {str(e)}")