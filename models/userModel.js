import db from "../config/db.js";

export const findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      }
    );
  });
};

export const findById = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT id, name, email, bio, contact FROM users WHERE id = ?",
      [id],
      (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      }
    );
  });
};

export const createUser = (name, email, password) => {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      }
    );
  });
};

export const updateUserProfile = (id, name, bio, contact) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE users SET name=?, bio=?, contact=? WHERE id=?",
      [name, bio, contact, id],
      (err) => {
        if (err) return reject(err);
        resolve();
      }
    );
  });
};

export const deleteUserById = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "DELETE FROM users WHERE id=?",
      [id],
      (err) => {
        if (err) return reject(err);
        resolve();
      }
    );
  });
};