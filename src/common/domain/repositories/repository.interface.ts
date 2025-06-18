export interface RepositoryInterface<Model, CreateProps> {
    create(props: CreateProps): Promise<Model>;
}
 