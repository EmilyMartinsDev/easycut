import { Router } from "express";
import { ServicoService } from "./services/servico.service";
import { ServicoRepo } from "./repositories/servico.repo";
import { ServicoController } from "./controllers/servico.controller";

const prismaRepo = new ServicoRepo();
const servicoService = new ServicoService(prismaRepo)
const servicoController = new ServicoController(servicoService);



const router = Router()
router.get("/servico", servicoController.getAll.bind(servicoController));
router.get("/servico/:id", servicoController.getById.bind(servicoController));
router.put("/servico/:id", servicoController.update.bind(servicoController));
router.delete("/servico/:id", servicoController.delete.bind(servicoController));
router.post("/servico", servicoController.create.bind(servicoController));

export default router