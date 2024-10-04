import { IIDGenerator } from "../ports/id-generator.interface";
import { v4 as uuidv4} from "uuid"

export class RandomIDGenerator implements IIDGenerator {
    generate(): string {
        return uuidv4()
    }
}