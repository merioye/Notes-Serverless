import {
  PutItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  GetItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { dbClient } from "../config";
import { Note } from "../types";
import { createdResponse, errorResponse, successResponse } from "../helpers";

const NOTES_TABLE_NAME = process.env.NOTES_TABLE_NAME;

export class NotesRepository {
  async create(note: Note) {
    try {
      const command = new PutItemCommand({
        TableName: NOTES_TABLE_NAME,
        Item: marshall(note, { convertClassInstanceToMap: true }),
        ConditionExpression: "attribute_not_exists(id)",
      });

      await dbClient.send(command);
      return createdResponse(note);
    } catch (err) {
      return errorResponse(500, err);
    }
  }

  async update(filter: { id: number }, update: Omit<Note, "id">) {
    try {
      const command = new UpdateItemCommand({
        TableName: NOTES_TABLE_NAME,
        Key: marshall(filter),
        UpdateExpression: "set #title = :title, #body = :body",
        ExpressionAttributeNames: {
          "#title": "title",
          "#body": "body",
        },
        ExpressionAttributeValues: marshall({
          ":title": update.title,
          ":body": update.body,
        }),
      });

      await dbClient.send(command);
      return successResponse("Updation successfull", { ...filter, ...update });
    } catch (err) {
      return errorResponse(500, err);
    }
  }

  async delete(filter: { id: number }) {
    try {
      const command = new DeleteItemCommand({
        TableName: NOTES_TABLE_NAME,
        Key: marshall(filter),
        ConditionExpression: "attribute_exists(id)",
      });

      await dbClient.send(command);
      return successResponse("Deletion successfull");
    } catch (err) {
      return errorResponse(500, err);
    }
  }

  async find() {
    try {
      const command = new ScanCommand({
        TableName: NOTES_TABLE_NAME,
      });

      const { Items } = await dbClient.send(command);
      const items = Items.map((itm) => unmarshall(itm));
      return successResponse("Successfull", items);
    } catch (err) {
      return errorResponse(500, err);
    }
  }

  async findOne(filter: { id: number }) {
    try {
      const command = new GetItemCommand({
        TableName: NOTES_TABLE_NAME,
        Key: marshall(filter),
      });

      const { Item } = await dbClient.send(command);
      return successResponse(
        "Successfull",
        Item ? unmarshall(Item) : { note: null }
      );
    } catch (err) {
      return errorResponse(500, err);
    }
  }
}
