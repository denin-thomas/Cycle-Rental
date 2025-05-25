const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const PgSession = require('connect-pg-simple')(session);
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3001;
const QRCode = require('qrcode');
// Replace with your PostgreSQL connection details
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'db_cycle_rental',
  password: 'password',
  port: 5432,
});
app.use(cookieParser());


const pgSessionStore = new PgSession({
  pool: pool,
  tableName: 'sessions',
  schemaName: 'public', // Specify the schema if needed
  createTableIfMissing: true, // Ensure the table is created if missing
  pruneSessionInterval: false, // Set to false to disable pruning
  // Specify custom column names if needed
  schemaName: 'public',
  session_id_column: 'custom_sid',
  data_column: 'custom_sess',
  expiration_column: 'custom_expire',
});
app.use(session({
  store: pgSessionStore,
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: false,
  cookie: {
    secure: true,
    maxAge: null,  // Set the maxAge to null for a session cookie
    expires: false,  // Set expires to false for a session cookie
  }
}));



app.use(bodyParser.json());


app.use(bodyParser.json());

// Allow requests from any origin
const corsOptions = {
  origin: '*',
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));


app.get('/',async (req, res) => {
  
 
  if ( session.login_id) {
    return res.json({ valid: true, login_id: session.login_id ,login_type:session.login_type});
  } else {
    return res.json({ valid: false ,login_id:'',login_type:''});
  }
});
// Logout route
app.post('/logout', (req, res) => {
  session.login_id = null; // Set login_id to null or undefined
  console.log('logout');
  res.json({ success: true, message: 'Logout successful' });
});



app.post('/api/addStaff', async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const formData = req.body;

    // Insert into tbl_login
    const loginQuery = 'INSERT INTO tbl_login(email, phno,password,login_type,login_status) VALUES($1, $2,$3,$4,$5) RETURNING login_id';
    const loginValues = [
      formData.email,
      formData.phoneNumber,
      formData.confirmpassword,
      formData.login_type,
      formData.login_status='a',
    
    ];

    const loginResult=await client.query(loginQuery, loginValues);
    const loginId = loginResult.rows[0].login_id;

  
  
    // Insert into tbl_staff
    const staffQuery = 'INSERT INTO tbl_staff(login_id,s_fname, s_mname, s_lname, s_dist, s_pin, s_street, s_hno, s_state, s_dob,s_gender) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9,$10,$11)';
    const staffValues = [
      loginId,
      formData.firstName, 
      formData.middlename,
      formData.lastName,
      formData.district,
      formData.pin,
      formData.street,
      formData.hno,
      formData.state,
      formData.dob,
      formData.gender
    ];

    await client.query(staffQuery, staffValues);

    await client.query('COMMIT');
    res.status(200).json({ success: true, message: 'Data inserted successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error inserting data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});


app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the provided username and password match a user in the database
    const result = await pool.query('SELECT * FROM tbl_login WHERE email = $1 and password = $2', [username,password]);

    if (result.rows.length > 0) {
      const r = result.rows[0];
      
      session.login_id = r.login_id;
     session.login_type=r.login_type;
     if(session.login_type=='c')
     {
    
      const custResult = await pool.query('SELECT * FROM tbl_customer WHERE login_id = $1 ', [r.login_id]);
    const re=custResult.rows[0];
  
    session.cust_id=re.cust_id;
   
    }
    if(session.login_type=='s')
     {
    
      const custResult = await pool.query('SELECT * FROM tbl_staff WHERE login_id = $1 ', [r.login_id]);
    const resu=custResult.rows[0];
  
    session.staff_id=resu.staff_id;
   
    }
    if(session.login_type=='m')
    {
   
     const custResult = await pool.query('SELECT * FROM tbl_staff WHERE login_id = $1 ', [r.login_id]);
   const resu=custResult.rows[0];
 
   session.staff_id=resu.staff_id;
  
   }
      res.json({ success: true, message: 'Login successful' , login_id : r.login_id});
      
    } else {
      res.status(401).json({ success: false, message: 'Login failed' });
    }
  } catch (error) {
    console.error('Error executing SQL query:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});
app.get('/api/generateQRCode', async (req, res) => {
  try {
    const { cycleId, websiteUrl } = req.query;
    if (!cycleId || !websiteUrl) {
      return res.status(400).json({ error: 'cycleId and websiteUrl are required' });
    }

    // Generate the QR code
    const qrCodeValue = `${websiteUrl}/cycle/${cycleId}`;
    const qrCodeDataURL = await QRCode.toDataURL(qrCodeValue);

    // Respond with the QR code data URL
    res.send(qrCodeDataURL);
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});
/*
app.post('/api/addCustomer', async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const formData = req.body;

    // Insert into login table first
    const loginQuery = 'INSERT INTO tbl_login(email,phno,password,login_type,login_status) VALUES($1, $2,$3,$4,$5) RETURNING login_id';
    const loginValues = [formData.email, formData.phoneNumber,formData.confirmpassword,formData.login_type='c',
    formData.login_status='a'];

    const loginResult = await client.query(loginQuery, loginValues);

    const loginId = loginResult.rows[0].login_id;

  
   
    session.login_id = loginId;
    session.login_type='c';
     console.log( session.login_id);
    // Now insert into customer table with the login_id as a foreign key
    const customerQuery = 'INSERT INTO tbl_customer(login_id,c_fname, c_mname, c_lname ,c_dist, c_pin, c_street, c_hno, c_state, c_dob) VALUES($1, $2, $3, $4,$5,$6,$7,$8,$9,$10)RETURNING cust_id';
    const customerValues = [
      loginId,
      formData.firstName,
      formData.middleName,
      formData.lastName,
      formData.district,
      formData.pin,
      formData.street,
      formData.hno,
      formData.state,
      formData.dob
    ];
const package_id=1;
    const result=await client.query(customerQuery, customerValues);
    const custId=result.rows[0].cust_id;
    session.cust_id = custId;
    console.log( session.cust_id);
    await client.query(
      'INSERT INTO tbl_cust_package(cust_id, package_id, start_date) VALUES($1, $2, CURRENT_DATE)',
      [custId, package_id]
    );
    await client.query('COMMIT');
    res.status(200).json({ success: true, message: 'Data inserted successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error inserting data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});
*/
app.post('/api/addCustomer', async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const formData = req.body;

    // Insert into login table first
    const loginQuery = 'INSERT INTO tbl_login(email,phno,password,login_type,login_status) VALUES($1, $2,$3,$4,$5) RETURNING login_id';
    const loginValues = [formData.email, formData.phoneNumber,formData.confirmpassword,formData.login_type='c',
    formData.login_status='a'];

    const loginResult = await client.query(loginQuery, loginValues);

    const loginId = loginResult.rows[0].login_id;

  
   
    session.login_id = loginId;
    session.login_type='c';
     console.log( session.login_id);
    // Now insert into customer table with the login_id as a foreign key
    const customerQuery = 'INSERT INTO tbl_customer(login_id,c_fname, c_mname, c_lname ,c_dist, c_pin, c_street, c_hno, c_state, c_dob) VALUES($1, $2, $3, $4,$5,$6,$7,$8,$9,$10)RETURNING cust_id';
    const customerValues = [
      loginId,
      formData.firstName,
      formData.middleName,
      formData.lastName,
      formData.district,
      formData.pin,
      formData.street,
      formData.hno,
      formData.state,
      formData.dob
    ];


    const result=await client.query(customerQuery, customerValues);
    const custId=result.rows[0].cust_id;
    session.cust_id = custId;
    console.log( session.cust_id);
   
    await client.query('COMMIT');
    res.status(200).json({ success: true, message: 'Data inserted successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error inserting data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});
app.post('/api/addPackage', async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const formData = req.body;

    // Insert into your package table (modify the table/column names accordingly)
    const packageQuery = 'INSERT INTO tbl_package(p_name,p_duration, p_price, description) VALUES($1, $2, $3, $4)';
    const packageValues = [
      formData.name,
      formData.duration,
      formData.price,
      formData.description,
    ];

    await client.query(packageQuery, packageValues);

    await client.query('COMMIT');
    res.status(200).json({ success: true, message: 'Package added successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding package:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});
app.get('/api/viewPackage', async (req, res) => {
  const client = await pool.connect();

  try {
    const result = await client.query('SELECT * FROM tbl_package where package_id != 1');

    const packageData = result.rows;

    res.status(200).json({ success: true, data: packageData });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});
app.post('/api/rent/:cycle_id', async (req, res) => {
  const client = await pool.connect();
  const { cycle_id } = req.params;
  try {
    await client.query('BEGIN');

    const cust_id = session.cust_id;

    // Insert into your package table (modify the table/column names accordingly)
    const packageQuery = 'INSERT INTO tbl_rental(cust_id, cycle_id,rental_status, start_time) VALUES($1, $2,$3,  CURRENT_TIMESTAMP) RETURNING rental_id';
    const packageValues = [
      cust_id,  // removed nested array
      cycle_id,
      'u'
    ];

    const result = await client.query(packageQuery, packageValues);

    await client.query('COMMIT');
    res.status(200).json({ success: true, message: 'Package added successfully', rental_id: result.rows[0].rental_id });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding package:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});

app.put('/api/updatePackage/:package_id', async (req, res) => {
  const packageId = parseInt(req.params.package_id);
  const updatedPackage = req.body;

  const client = await pool.connect();

  try {
    // Check if the package exists
    const checkResult = await client.query('SELECT * FROM tbl_package WHERE package_id = $1', [packageId]);

    if (checkResult.rows.length > 0) {
      // Package exists, proceed with the update
      const updateResult = await client.query(
        'UPDATE tbl_package SET p_name = $1, p_duration = $2, p_price = $3, description = $4 WHERE package_id = $5',
        [updatedPackage.p_name, updatedPackage.p_duration, updatedPackage.p_price, updatedPackage.description, packageId]
      );

      if (updateResult.rowCount > 0) {
        res.json({ success: true, message: 'Package updated successfully' });
      } else {
        res.status(500).json({ success: false, message: 'Error updating package' });
      }
    } else {
      // Package not found
      res.status(404).json({ success: false, message: 'Package not found' });
    }
  } catch (error) {
    console.error('Error updating package:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});
app.put('/api/updateCustomer/:customer_id', async (req, res) => {
  const customerId = parseInt(req.params.customer_id);
  const updatedCustomer = req.body;

  try {
    const client = await pool.connect();

    // Check if the customer exists
    const checkResult = await client.query('SELECT * FROM customers WHERE customer_id = $1', [customerId]);

    if (checkResult.rows.length > 0) {
      // Customer exists, proceed with the update
      const updateResult = await client.query(
        'UPDATE customers SET c_fname = $1, c_mname = $2, c_lname = $3, c_state = $4, c_dist = $5, c_street = $6 WHERE customer_id = $7',
        [updatedCustomer.c_fname, updatedCustomer.c_mname, updatedCustomer.c_lname, updatedCustomer.c_state, updatedCustomer.c_dist, updatedCustomer.c_street, customerId]
      );

      if (updateResult.rowCount > 0) {
        res.json({ success: true, message: 'Customer updated successfully' });
      } else {
        res.status(500).json({ success: false, message: 'Error updating customer' });
      }
    } else {
      // Customer not found
      res.status(404).json({ success: false, message: 'Customer not found' });
    }

    client.release();
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
app.post('/api/addHub', async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const formData = req.body;

    // Insert into your package table (modify the table/column names accordingly)
    const packageQuery = 'INSERT INTO tbl_cycle_hub(ch_state,ch_dist,ch_street,ch_capacity) VALUES($1, $2, $3, $4)';
    const packageValues = [
      formData.state,
      formData.district,
      formData.street,
      formData.capacity,
    ];

    await client.query(packageQuery, packageValues);

    await client.query('COMMIT');
    res.status(200).json({ success: true, message: 'Hub added successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding hub:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});
app.get('/api/viewHub', async (req, res) => {
  const client = await pool.connect();

  try {
    const result = await client.query('SELECT * FROM tbl_cycle_hub');
    const hubData = result.rows;

    res.status(200).json({ success: true, data: hubData });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});

app.put('/api/updateHub/:ch_id', async (req, res) => {
  const chId = parseInt(req.params.ch_id);
  const updatedHub = req.body;

  const client = await pool.connect();

  try {
    // Check if the package exists
    const checkResult = await client.query('SELECT * FROM tbl_cycle_hub WHERE ch_id = $1', [chId]);

    if (checkResult.rows.length > 0) {
      // Package exists, proceed with the update
      const updateResult = await client.query(
        'UPDATE tbl_cycle_hub SET ch_state = $1, ch_dist = $2, ch_street = $3,ch_capacity= $4 WHERE ch_id = $5',
        [updatedHub.ch_state, updatedHub.ch_dist, updatedHub.ch_street, updatedHub.ch_capacity, chId]
      );

      if (updateResult.rowCount > 0) {
        res.json({ success: true, message: 'Hub updated successfully' });
      } else {
        res.status(500).json({ success: false, message: 'Error updating Hub' });
      }
    } else {
      // Package not found
      res.status(404).json({ success: false, message: 'Hub not found' });
    }
  } catch (error) {
    console.error('Error updating Hub:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});

app.get('/api/viewCategory', async (req, res) => {
  const client = await pool.connect();

  try {
    const result = await client.query('SELECT * FROM tbl_category');
    const categoryData = result.rows;

    res.status(200).json({ success: true, data: categoryData });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});
app.get('/api/viewSubCat', async (req, res) => {
  const client = await pool.connect();

  try {
    const result = await client.query('SELECT * FROM tbl_subcategory');
    const subCatData = result.rows;

    res.status(200).json({ success: true, data: subCatData });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});
app.get('/api/viewStaff', async (req, res) => {
  const client = await pool.connect();

  try {
    const result = await client.query('SELECT * FROM tbl_staff');
    const staffData = result.rows;

    res.status(200).json({ success: true, data: staffData });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});
const multer = require('multer');
const path = require('path');

// Set up multer storage
const storage = multer.memoryStorage(); // Store file data in memory

// File upload middleware
const upload = multer({ storage: storage });

// Modify your route handler to include file upload middleware
app.post('/api/addCycle', upload.single('image'), async (req, res) => {
  const client = await pool.connect();

  try {
    const { hub_id, subcat_id, date } = req.body;
    const imageData = req.file.buffer; // Get image data from the buffer

    // Insert data into tbl_cycle along with the image data
    const insertQuery = `
      INSERT INTO tbl_cycle (ch_id, subcat_id, cy_date, cy_status, cy_image)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING cycle_id;`;

    const result = await client.query(insertQuery, [hub_id, subcat_id, date, 'a', imageData]);
    const insertedCycleId = result.rows[0].cycle_id;

    res.status(200).json({ success: true, cycle_id: insertedCycleId });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});
app.get('/api/viewCycle', async (req, res) => {
  const client = await pool.connect();

  try {
    const result = await client.query('SELECT * FROM tbl_cycle');
    const cycleData = result.rows;

    res.status(200).json({ success: true, data: cycleData });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});
app.post('/api/addCategory', async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const formData = req.body;

    // Insert into your category table (modify the table/column names accordingly)
    const categoryQuery = 'INSERT INTO tbl_category(category_name, category_description) VALUES($1, $2)';
    const categoryValues = [
      formData.category_name,
      formData.category_description,
    ];

    await client.query(categoryQuery, categoryValues);

    await client.query('COMMIT');
    res.status(200).json({ success: true, message: 'Category added successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding category:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});
app.post('/api/addSubCat', async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const formData = req.body;

    // Insert into your category table (modify the table/column names accordingly)
    const subCatQuery = 'INSERT INTO tbl_subcategory(subcat_name, subcat_description) VALUES($1, $2)';
    const subCatValues = [
      formData.subcat_name,
      formData.subcat_description,
    ];

    await client.query(subCatQuery, subCatValues);

    await client.query('COMMIT');
    res.status(200).json({ success: true, message: 'Category added successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding category:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});
app.post('/api/addcard/:package_id', async (req, res) => {
  const package_id = parseInt(req.params.package_id);
  console.log(package_id);
  console.log(req.params.package_id);
  
  if (isNaN(package_id)) {
    return res.status(400).json({ success: false, message: 'Invalid package_id' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const cust_id = session.cust_id;
    const formData = req.body;
    const packageQuery = await client.query(
      'SELECT p_price,p_duration FROM tbl_package WHERE package_id = $1',
      [package_id]
    );
    const p_price = packageQuery.rows[0].p_price;
const p_duration=packageQuery.rows[0].p_duration;
    // Insert into tbl_card
    const cardResult = await client.query(
      'INSERT INTO tbl_card(cust_id, card_no, holder_name, cvv2, exp_date) VALUES($1, $2, $3, $4, $5) RETURNING card_id',
      [cust_id, formData.card_no, formData.holder_name, formData.cvv2, formData.exp_date]
    );

    const card_id = cardResult.rows[0].card_id;

    // Assuming package_id is part of the form data
    const paymentResult = await client.query(
      'INSERT INTO tbl_mast_payment(cust_id,card_id,amount, payment_date) VALUES($1, $2,$3, CURRENT_DATE) RETURNING payment_id',
      [cust_id, card_id,p_price]
    );
    const payment_id = paymentResult.rows[0].payment_id;
    await client.query(
      'INSERT INTO tbl_package_payment(payment_id,package_id) VALUES($1, $2)',
      [payment_id, package_id]
    );
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + p_duration);
    // Insert into tbl_cust_package
    await client.query(
      'INSERT INTO tbl_cust_package(cust_id, package_id,end_date, start_date) VALUES($1, $2,$3, CURRENT_DATE)',
      [cust_id, package_id,endDate]
    );

    await client.query('COMMIT');
    res.status(200).json({ success: true, message: 'Card, payment, and package details added successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding card, payment, and package details:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});

app.post('/api/rentalpayment/:cycle_id/:amount', async (req, res) => {
  const { cycle_id, amount } = req.params;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const cust_id = session.cust_id;
    console.log(cust_id);
    const formData = req.body;

    // Insert into tbl_card
    const cardResult = await client.query(
      'INSERT INTO tbl_card(cust_id, card_no, holder_name, cvv2, exp_date) VALUES($1, $2, $3, $4, $5) RETURNING card_id',
      [cust_id, formData.card_no, formData.holder_name, formData.cvv2, formData.exp_date]
    );

    const card_id = cardResult.rows[0].card_id;

    const rentalResult = await client.query(
      'INSERT INTO tbl_rental(cust_id, cycle_id, start_time) VALUES($1, $2,  CURRENT_TIMESTAMP) RETURNING rental_id',
      [cust_id, cycle_id]
    );

    const rental_id = rentalResult.rows[0].rental_id;

    const paymentResult = await client.query(
      'INSERT INTO tbl_mast_payment(cust_id, card_id,amount, payment_date) VALUES($1, $2,$3, CURRENT_DATE) RETURNING payment_id',
      [cust_id, card_id,amount]
    );

    const payment_id = paymentResult.rows[0].payment_id;

    await client.query(
      'INSERT INTO tbl_rental_payment(payment_id, rental_id) VALUES($1, $2)',
      [payment_id, rental_id]
    );
//needs to update tbl_rental staus to unlock
await client.query("UPDATE tbl_rental SET rental_status='u' where rental_id = $1",[rental_id]);
await client.query("UPDATE tbl_cycle SET cy_status='u' where cycle_id = $1",[cycle_id]);
    await client.query('COMMIT');
    res.status(200).json({ success: true, message: 'Card, payment, and rental details added successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding card, payment, and rental details:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});
app.post('/api/rentallockpayment/:amount', async (req, res) => {
 
  const {  amount } = req.params;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const cust_id = session.cust_id;
    console.log(cust_id);
    const formData = req.body;

    // Insert into tbl_card
    const cardResult = await client.query(
      'INSERT INTO tbl_card(cust_id, card_no, holder_name, cvv2, exp_date) VALUES($1, $2, $3, $4, $5) RETURNING card_id',
      [cust_id, formData.card_no, formData.holder_name, formData.cvv2, formData.exp_date]
    );

    const card_id = cardResult.rows[0].card_id;

    const rentalResult = await client.query('SELECT * FROM tbl_rental WHERE cust_id = $1 AND rental_status = $2', [cust_id, 'u']);


    const rental_id = rentalResult.rows[0].rental_id;
const cycle_id=rentalResult.rows[0].cycle_id;
    const paymentResult = await client.query(
      'INSERT INTO tbl_mast_payment(cust_id, card_id, amount,payment_date) VALUES($1, $2,$3, CURRENT_DATE) RETURNING payment_id',
      [cust_id, card_id,amount]
    );

    const payment_id = paymentResult.rows[0].payment_id;

    await client.query(
      'INSERT INTO tbl_rental_payment(payment_id, rental_id) VALUES($1, $2)',
      [payment_id, rental_id]
    );
//needs to update tbl_rental staus to unlock
await client.query("UPDATE tbl_rental SET rental_status='l',end_time= CURRENT_DATE,cost=$2 where rental_id=$1",[rental_id,amount]);
await client.query("UPDATE tbl_cycle SET cy_status='l' where cycle_id=$1",[cycle_id]);
    await client.query('COMMIT');
    res.status(200).json({ success: true,rental_id:rental_id, message: 'Card, payment, and rental details added successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding card, payment, and rental details:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});
app.post('/api/rentallock', async (req, res) => {
 


  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const cust_id = session.cust_id;
    console.log(cust_id);
   

    // Insert into tbl_card
   

   

    const rentalResult = await client.query('SELECT * FROM tbl_rental WHERE cust_id = $1 AND rental_status = $2', [cust_id, 'u']);


    const rental_id = rentalResult.rows[0].rental_id;
const cycle_id=rentalResult.rows[0].cycle_id;
 

   


await client.query("UPDATE tbl_rental SET rental_status='l',end_time=CURRENT_DATE,cost=$2 where rental_id=$1",[rental_id,0]);
await client.query("UPDATE tbl_cycle SET cy_status='l' where cycle_id=$1",[cycle_id]);
    await client.query('COMMIT');
    res.status(200).json({ success: true,rental_id:rental_id, message: 'Card, payment, and rental details added successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding card, payment, and rental details:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});
app.get('/api/getRental', async (req, res) => {
 

  const client = await pool.connect();

  try {
    const cust_id=session.cust_id;
    const result = await client.query('SELECT * FROM tbl_rental WHERE cust_id = $1 AND rental_status = $2', [cust_id, 'u']);

    if (result.rows.length > 0) {
      const packageData = result.rows[0];
      res.status(200).json({ success: true, data: packageData });
    } else {
      res.status(404).json({ success: false, message: 'rental data not found' });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});
app.get('/api/getRentalDetails/:rental_id', async (req, res) => {
 

  const client = await pool.connect();

  try {
    const { rental_id } = req.params;
   
    const result = await client.query('SELECT * FROM tbl_rental WHERE rental_id = $1', [rental_id]);

    if (result.rows.length > 0) {
      const packageData = result.rows[0];
      res.status(200).json({ success: true, data: packageData });
    } else {
      res.status(404).json({ success: false, message: 'rental data not found' });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});
app.get('/api/getRentall', async (req, res) => {
 

  const client = await pool.connect();

  try {
    const custId = session.cust_id;
   
    const result = await client.query('SELECT * FROM tbl_rental WHERE cust_id = $1 AND rental_status = $2', [custId, 'u']);


    if (result.rows.length > 0) {
      const packageData = result.rows[0];
      res.status(200).json({ success: true, data: packageData });
    } else {
      res.status(404).json({ success: false, message: 'rental data not found' });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});
app.get('/api/getCustomer', async (req, res) => {
  const login_id = session.login_id;

  if (!login_id) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }

  console.log('profile:', login_id);
  const client = await pool.connect();

  try {
    const result = await client.query('SELECT * FROM tbl_customer c JOIN tbl_login l ON c.login_id = l.login_id WHERE c.login_id = $1;', [login_id]);

    if (result.rows.length > 0) {
      const customerData = result.rows[0];
      
      res.status(200).json({ success: true, data: customerData });
    } else {
      res.status(404).json({ success: false, message: 'Customer data not found' });
    }
  } catch (error) {
    console.error('Error fetching data', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});
app.get('/api/getPackage/:package_id', async (req, res) => {
  const { package_id } = req.params;

  const client = await pool.connect();

  try {
    const result = await client.query('SELECT * FROM tbl_package WHERE package_id = $1', [package_id]);

    if (result.rows.length > 0) {
      const packageData = result.rows[0];
      res.status(200).json({ success: true, data: packageData });
    } else {
      res.status(404).json({ success: false, message: 'Package not found' });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});
app.get('/api/getHub/:ch_id', async (req, res) => {
  const { ch_id } = req.params;

  const client = await pool.connect();

  try {
    const result = await client.query('SELECT * FROM tbl_cycle_hub WHERE ch_id = $1', [ch_id]);

    if (result.rows.length > 0) {
      const hubData = result.rows[0];
      res.status(200).json({ success: true, data: hubData });
    } else {
      res.status(404).json({ success: false, message: 'Hub not found' });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});
app.get('/api/getCategory/:category_id', async (req, res) => {
  const { category_id } = req.params;

  const client = await pool.connect();

  try {
    const result = await client.query('SELECT * FROM tbl_category WHERE category_id = $1', [category_id]);

    if (result.rows.length > 0) {
      const categoryData = result.rows[0];
      res.status(200).json({ success: true, data: categoryData });
    } else {
      res.status(404).json({ success: false, message: 'Category not found' });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});
app.get('/api/getCycle/:cycle_id', async (req, res) => {
  const { cycle_id } = req.params;

  const client = await pool.connect();

  try {
    const result = await client.query('SELECT * FROM tbl_cycle WHERE cycle_id = $1', [cycle_id]);

    if (result.rows.length > 0) {
      const cycleData = result.rows[0];
    
      res.status(200).json({ success: true, data: cycleData });
    } else {
      res.status(404).json({ success: false, message: 'Cycle not found' });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});
app.get('/api/getSubCat/:subcat_id', async (req, res) => {
  

  const client = await pool.connect();

  try {
    const { subcat_id } = req.params;
    console.log(subcat_id);
    const result = await client.query('SELECT * FROM tbl_subcategory WHERE subcat_id = $1', [subcat_id]);

    if (result.rows.length > 0) {
      const subCatData = result.rows[0];
      res.status(200).json({ success: true, data: subCatData });
    } else {
      res.status(404).json({ success: false, message: 'Package not found' });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});
app.get('/api/getStaff/:staff_id', async (req, res) => {
  const { staff_id } = req.params;

  const client = await pool.connect();

  try {
    const result = await client.query('SELECT * FROM tbl_staff WHERE staff_id = $1', [staff_id]);

    if (result.rows.length > 0) {
      const staffData = result.rows[0];
      res.status(200).json({ success: true, data: staffData });
    } else {
      res.status(404).json({ success: false, message: 'Package not found' });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});
app.get('/api/getCustomerPackage', async (req, res) => {
  const cust_id = session.cust_id;

  if (!cust_id) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }

  const client = await pool.connect();

  try {
    const result = await client.query('SELECT * FROM tbl_cust_package WHERE cust_id = $1 and end_date >= CURRENT_DATE', [cust_id]);

    if (result.rows.length > 0) {
      const custPackData = result.rows[0];
     
      res.status(200).json({ success: true, data: custPackData });
    } else {
      res.status(404).json({ success: false, message: 'Package not found' });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});

app.put('/api/updateCategory/:category_id', async (req, res) => {
  const categoryId = parseInt(req.params.category_id);
  const updatedCategory = req.body;

  const client = await pool.connect();

  try {
    // Check if the package exists
    const checkResult = await client.query('SELECT * FROM tbl_category WHERE category_id = $1', [categoryId]);

    if (checkResult.rows.length > 0) {
      // Package exists, proceed with the update
      const updateResult = await client.query(
        'UPDATE tbl_category SET category_name = $1, category_description = $2 WHERE category_id = $3',
        [updatedCategory.category_name, updatedCategory.category_description, categoryId]
      );

      if (updateResult.rowCount > 0) {
        res.json({ success: true, message: 'Package updated successfully' });
      } else {
        res.status(500).json({ success: false, message: 'Error updating package' });
      }
    } else {
      // Package not found
      res.status(404).json({ success: false, message: 'Package not found' });
    }
  } catch (error) {
    console.error('Error updating package:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});
app.put('/api/updateSubCat/:subcat_id', async (req, res) => {
  const subCatId = parseInt(req.params.subcat_id);
  const updatedSubCat = req.body;

  const client = await pool.connect();

  try {
    // Check if the package exists
    const checkResult = await client.query('SELECT * FROM tbl_subcategory WHERE subcat_id = $1', [subCatId]);

    if (checkResult.rows.length > 0) {
      // Package exists, proceed with the update
      const updateResult = await client.query(
        'UPDATE tbl_subcategory SET subcat_name = $1, subcat_description = $2 WHERE subcat_id = $3',
        [updatedSubCat.subcat_name, updatedSubCat.subcat_description, subCatId]
      );

      if (updateResult.rowCount > 0) {
        res.json({ success: true, message: 'Package updated successfully' });
      } else {
        res.status(500).json({ success: false, message: 'Error updating package' });
      }
    } else {
      // Package not found
      res.status(404).json({ success: false, message: 'Package not found' });
    }
  } catch (error) {
    console.error('Error updating package:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});
app.put('/api/updateStaff/:staff_id', async (req, res) => {
  const staffId = parseInt(req.params.staff_id);
  const updatedStaff = req.body;

  const client = await pool.connect();

  try {
    // Check if the package exists
    const checkResult = await client.query('SELECT * FROM tbl_staff WHERE staff_id = $1', [staffId]);

    if (checkResult.rows.length > 0) {
      // Package exists, proceed with the update
      const updateResult = await client.query(
        'UPDATE tbl_staff SET s_fname = $1,s_mname= $2,s_lname= $3,s_gender = $4,s_state=$5,s_dist=$6,s_street=$7,s_pin=$8,s_hno=$9,s_dob=$10  WHERE staff_id = $11',
        [updatedStaff.s_fname, updatedStaff.s_mname,updatedStaff.s_lname,updatedStaff.s_gender,updatedStaff.s_state,updatedStaff.s_dist,updatedStaff.s_street,updatedStaff.s_pin,updatedStaff.s_hno,updatedStaff.s_dob,staffId]
      );

      if (updateResult.rowCount > 0) {
        res.json({ success: true, message: 'Package updated successfully' });
      } else {
        res.status(500).json({ success: false, message: 'Error updating package' });
      }
    } else {
      // Package not found
      res.status(404).json({ success: false, message: 'Package not found' });
    }
  } catch (error) {
    console.error('Error updating package:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});
// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// Assuming you have a dedicated endpoint for fetching the staff count
app.get('/api/getStaffCount', async (req, res) => {
  const client = await pool.connect();

  try {
    const result = await client.query('SELECT COUNT(*) FROM tbl_staff');
    const staffCount = result.rows[0].count;

    res.status(200).json({ success: true, data: staffCount });
  } catch (error) {
    console.error('Error fetching staff count:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});

app.get('/api/getCycleCount', async (req, res) => {
  const client = await pool.connect();

  try {
    const result = await client.query('SELECT COUNT(*) FROM tbl_cycle');
    const cycleCount = result.rows[0].count;

    res.status(200).json({ success: true, data: cycleCount });
  } catch (error) {
    console.error('Error fetching cycle count:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});
app.get('/api/getHubCount', async (req, res) => {
  const client = await pool.connect();

  try {
    const result = await client.query('SELECT COUNT(*) FROM tbl_cycle_hub');
    const hubCount = result.rows[0].count;

    res.status(200).json({ success: true, data: hubCount });
  } catch (error) {
    console.error('Error fetching staff count:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});

app.get('/api/getUserCount', async (req, res) => {
  const client = await pool.connect();

  try {
    const result = await client.query('SELECT COUNT(*) FROM tbl_customer');
    const userCount = result.rows[0].count;

    res.status(200).json({ success: true, data: userCount });
  } catch (error) {
    console.error('Error fetching user count:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});
app.post('/api/addMaintenance', async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const formData = req.body;

    // Insert into your package table (modify the table/column names accordingly)
    const packageQuery = 'INSERT INTO tbl_maintenance(ch_id,staff_id,date,description,status) VALUES($1, $2, $3,$4,$5)';
    const packageValues = [
      formData.ch_id,
           formData.staff_id,
           formData.date,
           formData.description,
           'a'
    ];

    await client.query(packageQuery, packageValues);

    await client.query('COMMIT');
    res.status(200).json({ success: true, message: 'Maintenance added successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding Maintenance:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});
app.get('/api/viewMaintenance', async (req, res) => {
  const client = await pool.connect();

  try {
    const result = await client.query('SELECT * FROM tbl_maintenance');
    const maintenanceData = result.rows;

    res.status(200).json({ success: true, data: maintenanceData });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});
app.get('/api/viewMaintenanceAssigned', async (req, res) => {
  const client = await pool.connect();

  try {
    const staffId = session.staff_id;
    const result = await client.query('SELECT * FROM tbl_maintenance where staff_id = $1',[staffId]);
    const maintenanceData = result.rows;

    res.status(200).json({ success: true, data: maintenanceData });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});
app.get('/api/viewRentalReport', async (req, res) => {
  const client = await pool.connect();

  try {
    const result = await client.query('SELECT * FROM tbl_rental');
    const maintenanceData = result.rows;

    res.status(200).json({ success: true, data: maintenanceData });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});
app.get('/download-qr-code/:cycleId', (req, res) => {
  const cycleId = req.params.cycleId;
  // Generate QR code data URL
  const qrCodeUrl = 'http://localhost:3000'; // Implement QR code generation logic

  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Content-Disposition', `attachment; filename=qr_code_${cycleId}.png`);
  res.send(qrCodeUrl);
});

app.post('/api/addFeedback', async (req, res) => {
  const client = await pool.connect();

  try {
    const custId = session.cust_id;
    await client.query('BEGIN');

    const formData = req.body;

    // Insert into your package table (modify the table/column names accordingly)
    const feedbackQuery = 'INSERT INTO tbl_feedback(cust_id,name,phno,email,feedback) VALUES($1, $2, $3, $4,$5)';
    const feedbackValues = [
      custId,
      formData.name,
      formData.phno,
      formData.email,
      formData.feedback,
    ];

    await client.query(feedbackQuery, feedbackValues);

    await client.query('COMMIT');
    res.status(200).json({ success: true, message: 'feedback added successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding feedback:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});
/*
app.put('/api/replyFeedback/:feedback_id', async (req, res) => {
  const feedbackId = parseInt(req.params.feedback_id);
  const updatedCategory = req.body;

  const client = await pool.connect();

  try {
   

    if (checkResult.rows.length > 0) {
      // Package exists, proceed with the update
      const updateResult = await client.query(
        'UPDATE tbl_feedback  reply = $1 WHERE feedback_id = $1',
        [updatedCategory.reply,feedbackId]
      );

      if (updateResult.rowCount > 0) {
        res.json({ success: true, message: 'feedback updated successfully' });
      } else {
        res.status(500).json({ success: false, message: 'Error updating feedback' });
      }
    } else {
      // Package not found
      res.status(404).json({ success: false, message: 'feedback not found' });
    }
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});*/
app.put('/api/disableStaff/:staff_id', async (req, res) => {
  const staffId = parseInt(req.params.staff_id);
  

  const client = await pool.connect();

  try {
   

      // Package exists, proceed with the update
      const updateResult = await client.query(
        'UPDATE tbl_login SET login_status=$1  WHERE staff_id = $2',
        ['i',staffId]
      );

      if (updateResult.rowCount > 0) {
        res.json({ success: true, message: 'Package updated successfully' });
      } else {
        res.status(500).json({ success: false, message: 'Error updating package' });
      }
  
  } catch (error) {
    console.error('Error updating package:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});
app.get('/api/viewFeedback', async (req, res) => {
  const client = await pool.connect();

  try {
    const result = await client.query('SELECT * FROM tbl_feedback ');

    const packageData = result.rows;

    res.status(200).json({ success: true, data: packageData });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});