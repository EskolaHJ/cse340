-- Task 1: Insert a new record into the account table
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starknet.com', 'Iam1ronM@n');

--  Task 2: Update Tony Stark's account_type to "Admin"
UPDATE account
	SET account_type = 'Admin'
	WHERE account_email = 'tony@starknet.com';

-- task 3: Delete the Tony Stark record from the database
DELETE FROM account
	WHERE account_email = 'tony@starknet.com';

-- Task 4: modify the 'GM Hummer' Record description
UPDATE inventory
	SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
	WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Task 5: Inner join to select make, model, and classification name from "Sport" category
SELECT i.inv_make, i.inv_model, c.classification_name
	FROM inventory i
		INNER JOIN classification c
			ON i.classification_id = c.classification_id
				WHERE c.classification_name = 'Sport';

-- Task 6: Update all inventory records to add "/vehicles" to the file path
UPDATE inventory
	SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
		inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');