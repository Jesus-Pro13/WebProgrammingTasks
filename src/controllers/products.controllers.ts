import type { Request, Response } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../conf/dbConnection.ts";

export class ProductController {
  public async getAllProducts(_req: Request, res: Response) {
    try {
      const [products] = await pool.execute(
        "select id, name, price, stock, description, brand, img, active from products where active = true"
      );
      res.json(products);
    } catch {
      res.status(500).json({ message: "internal server error" });
    }
  }

  public async getProductById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const [products] = await pool.execute<RowDataPacket[]>(
        "select id, name, price, stock, description, brand, img, active from products where id = ? and active = true",
        [id]
      );
      if (!products[0]) {
        res.status(404).json({ message: "product not found" });
        return;
      }
      res.json(products[0]);
    } catch {
      res.status(500).json({ message: "internal server error" });
    }
  }

  public async createProduct(req: Request, res: Response) {
    try {
      const { name, price, stock, description, brand, img } = req.body;

      if (!name || typeof price !== "number" || price <= 0 || typeof stock !== "number" || !description) {
        res.status(400).json({ message: "invalid data" });
        return;
      }

      await pool.execute(
        "insert into products (name, price, stock, description, brand, img) values (?, ?, ?, ?, ?, ?)",
        [name, price, stock, description, brand || null, img || null]
      );
      res.status(201).json({ message: "product created" });
    } catch {
      res.status(500).json({ message: "internal server error" });
    }
  }

  public async updateProduct(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { name, price, stock, description, brand, img } = req.body;

      if (!name || typeof price !== "number" || price <= 0 || typeof stock !== "number" || !description) {
        res.status(400).json({ message: "invalid data" });
        return;
      }

      const [result] = await pool.execute<ResultSetHeader>(
        "update products set name = ?, price = ?, stock = ?, description = ?, brand = ?, img = ? where id = ? and active = true",
        [name, price, stock, description, brand || null, img || null, id]
      );

      if (result.affectedRows === 0) {
        res.status(404).json({ message: "product not found" });
        return;
      }
      res.json({ message: "product updated" });
    } catch {
      res.status(500).json({ message: "internal server error" });
    }
  }

  public async deleteProduct(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const [result] = await pool.execute<ResultSetHeader>(
        "update products set active = false where id = ? and active = true",
        [id]
      );
      
      if (result.affectedRows === 0) {
        res.status(404).json({ message: "product not found" });
        return;
      }
      res.json({ message: "product deleted" });
    } catch {
      res.status(500).json({ message: "internal server error" });
    }
  }

  public async changePrice(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { price } = req.body;

      if (typeof price !== "number" || price <= 0) {
        res.status(400).json({ message: "invalid price" });
        return;
      }

      const [result] = await pool.execute<ResultSetHeader>(
        "update products set price = ? where id = ? and active = true",
        [price, id]
      );

      if (result.affectedRows === 0) {
        res.status(404).json({ message: "product not found" });
        return;
      }
      res.json({ message: "price updated" });
    } catch {
      res.status(500).json({ message: "internal server error" });
    }
  }
}