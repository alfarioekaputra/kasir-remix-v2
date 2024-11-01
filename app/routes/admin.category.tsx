import { Separator } from '@radix-ui/react-separator';
import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { ColumnDef } from '@tanstack/react-table';
import Api from '~/api';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '~/components/ui/breadcrumb';
import { DataTable } from '~/components/ui/data-table';
import {
  SidebarInset,
  SidebarTrigger,
} from '~/components/ui/sidebar';
import { requireUserSession } from '~/services/session.server';

interface Category {
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
  items: [];
}

export async function loader({
  request,
}: LoaderFunctionArgs): Promise<Category> {
  await requireUserSession(request);
  const api = new Api();
  await api.setToken(request);

  const url = new URL(request.url);
  const page = url.searchParams.get('page') || '1';
  const perPage = url.searchParams.get('perPage') || '1';

  const response = await api.authClient(
    `/categories/records?page=${page}&perPage=${perPage}`,
    'get',
    {}
  );

  return response.data;
}

type ResponseData = {
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
  items: [];
};

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
];

export default function AdminCategory() {
  const data = useLoaderData() as ResponseData;

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Kasir</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Category</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <DataTable
          columns={columns}
          data={data.items}
          page={data.page}
          perPage={data.perPage}
          totalPages={data.totalPages}
        />
      </div>
    </SidebarInset>
  );
}
