import type {
  CreateParams,
  CreateResult,
  DataProvider,
  DeleteParams,
  DeleteResult,
  GetListParams,
  GetListResult,
  GetOneParams,
  GetOneResult,
  UpdateParams,
  UpdateResult,
} from 'react-admin';
import { supabase } from '../lib/supabaseClient';

const getRange = (page: number, perPage: number) => {
  const start = (page - 1) * perPage;
  const end = start + perPage - 1;
  return { start, end };
};

export const dataProvider: DataProvider = {
  async getList(resource: string, params: GetListParams): Promise<GetListResult> {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const { start, end } = getRange(page, perPage);

    let query = supabase
      .from(resource)
      .select('*', { count: 'exact' })
      .range(start, end)
      .order(field, { ascending: order === 'ASC' });

    if (params.filter) {
      Object.entries(params.filter).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return;
        query = query.ilike(key, `%${value}%`);
      });
    }

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      data: data ?? [],
      total: count ?? 0,
    };
  },

  async getOne(resource: string, params: GetOneParams): Promise<GetOneResult> {
    const { data, error } = await supabase.from(resource).select('*').eq('id', params.id).single();
    if (error) throw error;
    return { data };
  },

  async create(resource: string, params: CreateParams): Promise<CreateResult> {
    const { data, error } = await supabase.from(resource).insert(params.data).select('*').single();
    if (error) throw error;
    return { data };
  },

  async update(resource: string, params: UpdateParams): Promise<UpdateResult> {
    const { data, error } = await supabase
      .from(resource)
      .update(params.data)
      .eq('id', params.id)
      .select('*')
      .single();
    if (error) throw error;
    return { data };
  },

  async delete(resource: string, params: DeleteParams): Promise<DeleteResult> {
    const { data, error } = await supabase
      .from(resource)
      .delete()
      .eq('id', params.id)
      .select('*')
      .single();
    if (error) throw error;
    return { data };
  },
} as DataProvider;
