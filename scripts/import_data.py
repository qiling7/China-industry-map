import sqlite3
import csv

def import_industry_data(csv_file_path, db_path='../backend/industry.db'):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    with open(csv_file_path, 'r', encoding='utf-8') as file:
        csv_reader = csv.reader(file)
        next(csv_reader) 
        
        for row in csv_reader:
            cursor.execute(
                'INSERT INTO industries (region, city, category, description) VALUES (?, ?, ?, ?)',
                (row[0], row[1], row[2], row[3])
            )
            
    conn.commit()
    conn.close()

if __name__ == '__main__':
    import_industry_data('my_new_industries.csv')