import { APIGatewayProxyEventV2 } from "aws-lambda";
import { container } from "tsyringe";
import { NotesService } from "../services";

const notesService = container.resolve(NotesService);

const createNote = (event: APIGatewayProxyEventV2) => {
  return notesService.create(event);
};

const updateNote = (event: APIGatewayProxyEventV2) => {
  return notesService.update(event);
};

const deleteNote = (event: APIGatewayProxyEventV2) => {
  return notesService.delete(event);
};

const getAllNotes = () => {
  return notesService.find();
};

const getNote = (event: APIGatewayProxyEventV2) => {
  return notesService.findOne(event);
};

export { createNote, updateNote, deleteNote, getAllNotes, getNote };
