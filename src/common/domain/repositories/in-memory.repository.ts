import { randomUUID } from 'crypto';
import { NotFoundError } from '../errors/not-found-error';
import {
    RepositoryInterface,
    SearchInput,
    SearchOutput,
} from './repository.interface';

export type ModelProps = {
    id?: string;
    [key: string]: any;
};

export type CreateProps = {
    [key: string]: any;
};

export abstract class InMemoryRepository<Model extends ModelProps>
    implements RepositoryInterface<Model, CreateProps>
{
    items: Model[] = [];
    sortableFields: string[] = [];

    create(props: CreateProps): Model {
        const model = {
            id: randomUUID(),
            create_at: new Date(),
            update_at: new Date(),
            ...props,
        };

        return model as unknown as Model;
    }

    async insert(model: Model): Promise<Model> {
        this.items.push(model);
        return model;
    }

    async findById(id: string): Promise<Model> {
        return this._get(id);
    }

    async update(model: Model): Promise<Model> {
        await this._get(model.id);
        const index = this.items.findIndex(item => item.id === model.id);
        this.items[index] = model;
        return model;
    }

    async delete(id: string): Promise<void> {
        await this._get(id);
        const index = this.items.findIndex(item => item.id === id);
        this.items.splice(index, 1);
    }

    protected abstract applyFilter(
        items: Model[],
        filter: string | null,
    ): Promise<Model[]>;

    protected async applySort(
        itens: Model[],
        sort: string | null,
        sortDir: string | null,
    ): Promise<Model[]> {
        if (!sort || !this.sortableFields.includes(sort)) {
            return itens;
        }

        const sortedItems = [...itens].sort((a, b) => {
            if (a[sort] < b[sort]) return sortDir === 'desc' ? 1 : -1;
            if (a[sort] > b[sort]) return sortDir === 'desc' ? -1 : 1;
            return 0;
        });

        return sortedItems;
    }

    protected async applyPaginate(
        items: Model[],
        page: number,
        perPage: number,
    ): Promise<Model[]> {
        const start = (page - 1) * perPage;
        const limit = start + perPage;
        return items.slice(start, limit);
    }

    async search(props: SearchInput): Promise<SearchOutput<Model>> {
        const page = props.page ?? 1;
        const per_page = props.per_page ?? 15;
        const sort = props.sort ?? null;
        const sort_dir = props.sort_dir ?? null;
        const filter = props.filter ?? null;

        const filteredItems = await this.applyFilter(this.items, filter);
        const sortedItems = await this.applySort(filteredItems, sort, sort_dir);
        const paginatedItems = await this.applyPaginate(
            sortedItems,
            page,
            per_page,
        );

        return {
            items: paginatedItems,
            total: filteredItems.length,
            current_page: page,
            per_page,
            sort,
            sort_dir,
            filter,
        };
    }

    protected async _get(id: string): Promise<Model> {
        const model = this.items?.find(item => item?.id === id);

        if (!model) {
            throw new NotFoundError(`Model not found using ID ${id}.`);
        }

        return model;
    }
}
