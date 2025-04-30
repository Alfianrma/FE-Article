"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { Search } from "lucide-react";
import Pagination from "@/components/ui/pagination-custom";
import { getCookie } from "cookies-next/client";
import axios from "axios";
import { LoaderCircle, Plus } from "lucide-react";
import { Category } from "@/lib/types/DataArticlesType";
import moment from "moment";
import { useRouter } from "next/navigation";
import AddCategoryForm from "./addCategoryForm";
import Swal from "sweetalert2";
import EditCategoryForm from "./editCategoryForm";

function AdminCategoryPage() {
  const token = getCookie("token");
  const router = useRouter();
  //Dialog state
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [openEditCategory, setOpenEditCategory] = useState<string | null>(null);
  const [openDeleteCategory, setOpenDeleteCategory] = useState<string | null>(
    null
  );

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [perPage, setPerPage] = useState(9);
  const [loading, setLoading] = useState(true);
  //filter and search
  const searchRef = useRef<HTMLInputElement>(null);
  //Data list category
  const [listcategory, setListCategory] = useState<Category[]>([]);

  //Get list category
  const getCategories = useCallback(
    async (page: number) => {
      setLoading(true);
      const search = searchRef.current ? searchRef.current.value : "";
      const baseUrl = "https://test-fe.mysellerpintar.com/api/categories";
      const url = new URL(baseUrl);
      url.searchParams.set("page", page.toString());
      url.searchParams.set("limit", perPage.toString());
      url.searchParams.set("search", search);

      await axios
        .get(url.toString(), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setLoading(false);
          setListCategory(response.data.data);
          setTotalElements(response.data.total);
          setTotalPage(response.data.totalPages);
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    [searchRef, currentPage]
  );

  useEffect(() => {
    getCategories(currentPage);
  }, [getCategories, searchRef]);

  //Delete Category
  const deleteCategory = useCallback(async (id: string) => {
    const baseUrl = `https://test-fe.mysellerpintar.com/api/categories/${id}`;
    await axios
      .delete(baseUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setOpenDeleteCategory(null);
        getCategories(currentPage);
        Swal.fire("Success!", "Category deleted successfully", "success");
      })
      .catch((error) => {
        setOpenDeleteCategory(null);
        Swal.fire(
          "Error deleting category!",
          error.response.data.error,
          "error"
        );
      });
  }, []);

  return (
    <>
      <div className="bg-white rounded-t-xl border border-gray-200 p-4 w-full font-semibold">
        Total Articles: {totalElements}
      </div>
      <div className="p-4 border border-gray-200 bg-white flex flex-row gap-4 items-center justify-between">
        <div className="flex flex-row gap-4 items-center">
          <InputWithIcon
            className="bg-white"
            startIcon={Search}
            ref={searchRef}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                getCategories(1);
              }
            }}
            placeholder="Search title"
          />
        </div>
        <Dialog open={openAddCategory} onOpenChange={setOpenAddCategory}>
          <DialogTrigger asChild>
            <button className="p-2 bg-primaryBlue rounded-lg text-white text-sm flex flex-row gap-2 items-center justify-center hover:bg-primaryBlue/80 transition-all duration-200 ease-in-out hover:cursor-pointer">
              <Plus strokeWidth={2.5} /> Add Articles
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
            </DialogHeader>
            <AddCategoryForm
              closeDialog={() => setOpenAddCategory(false)}
              getCategory={() => getCategories(currentPage)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <Table className="w-full border border-gray-200">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Category</TableHead>
            <TableHead className="text-center">Created at</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white">
          {listcategory.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="text-center">{item.name}</TableCell>
              <TableCell className="text-center">
                {moment(item.createdAt).local().format("MMMM D, YYYY HH:mm:ss")}
              </TableCell>
              <TableCell>
                <div className="flex flex-row gap-2 items-center justify-center">
                  <Dialog
                    open={openEditCategory === item.id}
                    onOpenChange={(open) =>
                      setOpenEditCategory(open ? item.id : null)
                    }
                  >
                    <DialogTrigger asChild>
                      <div className="underline text-primaryBlue hover:cursor-pointer">
                        Edit
                      </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                      </DialogHeader>
                      <EditCategoryForm
                        closeDialog={() => setOpenEditCategory(null)}
                        getCategory={() => getCategories(currentPage)}
                        id={item.id}
                        name={item.name}
                      />
                    </DialogContent>
                  </Dialog>
                  <Dialog
                    open={openDeleteCategory === item.id}
                    onOpenChange={(open) =>
                      setOpenDeleteCategory(open ? item.id : null)
                    }
                  >
                    <DialogTrigger asChild>
                      <div className="underline text-red-500 hover:cursor-pointer">
                        Delete
                      </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Delete Category</DialogTitle>
                      </DialogHeader>
                      <DialogDescription>
                        {`Delete category “${item.name}”? This will remove it from master data permanently.`}
                      </DialogDescription>
                      <div className="flex items-center justify-end gap-4">
                        <button
                          className="bg-white text-black rounded-md border border-gray-200 px-2 py-1 hover:cursor-pointer"
                          type="button"
                          onClick={() => {
                            setOpenDeleteCategory(null);
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className="bg-red-500 text-white rounded-md border px-2 py-1 hover:bg-red-500/80 hover:cursor-pointer transition-all duration-200 ease-in-out"
                          type="button"
                          onClick={() => {
                            deleteCategory(item.id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex flex-row justify-center p-4 border border-gray-200 bg-white rounded-b-xl">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPage}
          totalElements={totalElements}
          onPageChange={(page: any) => setCurrentPage(page)}
        />
      </div>
    </>
  );
}

export default AdminCategoryPage;
