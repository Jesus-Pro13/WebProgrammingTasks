import express, { Router, type Express } from "express";

type ServerOptions = {
  port: number;
  routes: Router;
};

export class Server {
  private readonly port: number;
  private readonly server: Express;
  private readonly routes: Router;

  constructor(options: ServerOptions) {
    this.server = express();
    this.port = options.port;
    this.routes = options.routes;
  }

  public start = () => {
    this.server.use(express.json());
    
    // Aquí ya se inyecta el prefijo '/api' globalmente
    this.server.use("/api", this.routes);
    
    this.server.listen(this.port, () => {
      console.log(`Server running on port: ${this.port}`);
    });
  };
}