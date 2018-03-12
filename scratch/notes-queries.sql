-- SELECT ALL THE NOTES
SELECT * FROM notes;

-- SELECT ALL LIMIT TO 5
SELECT * FROM notes LIMIT 5;

-- SELECT ALL SORT 
SELECT * FROM notes ORDER BY id DESC;

-- SELECT WHERE TITLE MATCH STRING
SELECT * FROM notes WHERE title = '5 life lessons learned from cats';

-- SELECT WHERE TITLE IS LIKE A STRING
SELECT * FROM notes WHERE title LIKE '%ways%';

-- UPDATE NOTE
UPDATE notes
  SET title = 'New Title'
  WHERE id = '1005';

-- INSERT NOTE
INSERT INTO notes
  (title, content)
  VALUES
  ('Testing Title', 'Testing Content');

-- DELETE BY ID
DELETE FROM notes WHERE id = '1001';    
