import { APIGatewayProxyEventV2 } from "aws-lambda";
import { autoInjectable } from "tsyringe";
import { plainToInstance } from "class-transformer";
import { NotesRepository } from "../repositories";
import { CreateNoteDto, UpdateNoteDto } from "../dtos";
import { errorResponse, validateBody } from "../helpers";

@autoInjectable()
export class NotesService {
  private readonly repository: NotesRepository;

  constructor(repository: NotesRepository) {
    this.repository = repository;
  }

  async create(event: APIGatewayProxyEventV2) {
    const parsedBody = JSON.parse(event.body);
    const bodyInstance = plainToInstance(CreateNoteDto, parsedBody);
    const error = await validateBody(bodyInstance);
    if (error) return errorResponse(400, error);

    return this.repository.create(bodyInstance);
  }

  async update(event: APIGatewayProxyEventV2) {
    const id = parseInt(event.pathParameters.id);
    const parsedBody = JSON.parse(event.body);

    const bodyInstance = plainToInstance(UpdateNoteDto, parsedBody);
    const error = await validateBody(bodyInstance);
    if (error) return errorResponse(400, error);

    return this.repository.update({ id }, bodyInstance);
  }

  delete(event: APIGatewayProxyEventV2) {
    const id = parseInt(event.pathParameters.id);
    return this.repository.delete({ id });
  }

  find() {
    return this.repository.find();
  }

  findOne(event: APIGatewayProxyEventV2) {
    const id = parseInt(event.pathParameters.id);
    return this.repository.findOne({ id });
  }
}
