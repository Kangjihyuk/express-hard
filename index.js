const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const db = require("./conect");
const response = require("./response");
app.use(bodyParser.json());

app.get("/", (req, res) => {
  response(200, "ready to go", "success", res);
});

app.get("/mahasiswa", (req, res) => {
  const sql = "SELECT * FROM mahasiswa";
  db.query(sql, (err, fields) => {
    if (err) throw err;
    response(200, fields, "data berhasil ditambahkan", res);
  });
});

app.get("/mahasiswa/:nim", (req, res) => {
  const nim = req.params.nim;
  const sql = `SELECT * FROM mahasiswa WHERE nim = ${nim}`;
  db.query(sql, (err, fiels) => {
    if (err) throw err;
    response(200, fiels, `mahasiswa dengan nim ke ${nim}`, res);
  });
});

app.post("/mahasiswa", (req, res) => {
  const { nim, namaLengkap, kelas, alamat } = req.body;
  const sql = `INSERT INTO mahasiswa (nim,nama_lengkap,kelas,alamat) VALUES (${nim}, '${namaLengkap}' , '${kelas}', '${alamat}') `;
  db.query(sql, (err, fields) => {
    if (err) response(500, "data crash", "error", res);
    if (fields?.affectedRows) {
      const data = {
        id: fields.insertId,
        isSuccess: fields.affectedRows,
      };
      response(200, data, "data berhasil ditambahkan", res);
    }
    console.log(fields);
  });
});

app.put("/mahasiswa", (req, res) => {
  const { nim, namaLengkap, kelas, alamat } = req.body;
  const sql = `UPDATE mahasiswa SET nama_lengkap = '${namaLengkap}',kelas = '${kelas}', alamat = '${alamat}' WHERE nim = ${nim}`;
  db.query(sql, (err, fields) => {
    if (err) response(500, err, "data sudah diedit ngapain lagi kocak", res);
    if (fields?.affectedRows) {
      const data = {
        id: fields.insertId,
        message: fields.message,
      };
      response(200, data, "data berhasil diedit", res);
    } else {
      response(500, "error", `nomer dengan nim ke ${nim} itu gak ada`, res);
    }
  });
});
app.delete("/mahasiswa", (req, res) => {
  const { nim } = req.body;
  const sql = `DELETE FROM mahasiswa WHERE nim = ${nim}`;
  db.query(sql, (err, fields) => {
    if (err) response(500, err, "item tidak ada", res);
    if (fields?.affectedRows) {
      const data = {
        isDeleted: fields.affectedRows,
      };
      response(200, data, "delete", res);
    } else {
      response(404, "user not found", `nim dengan nomor ${nim} tidak ada`, res);
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
