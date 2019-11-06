import {BaseModel} from '../../core/base_model';
import {EntityController} from '../../controller/entity/entity_controller';

export class EntityGroupModel extends BaseModel {
    private members: EntityController[];
    private leader: EntityController;

    public constructor(members: EntityController[] = [], leader: EntityController = null) {
        super();

        this.members = members;
        this.leader = leader;

        members.forEach((controller: EntityController) => {
            controller.setEntityGroupInModel(this);
        });
    }
    public getMembers(): EntityController[] {
        return this.members;
    }
    public getLeader(): EntityController {
        return this.leader;
    }
    public isMember(entity: EntityController): boolean {
        return this.members.includes(entity);
    }
    public isLeader(entity: EntityController): boolean {
        return this.leader === entity;
    }
    public addMember(entity: EntityController): void {
        this.members.push(entity);
    }
    public setLeader(entity: EntityController): void {
        this.leader = entity;
    }
    public getSerializedData(): object {
        return {
            ...super.getSerializedData(),
        };
    }
    protected initialize(): void {
        this.members.forEach((controller: EntityController) => {
            controller.setEntityGroupInModel(this);
        });
    }
}
