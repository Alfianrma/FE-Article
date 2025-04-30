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

import { InputWithIcon } from "@/components/ui/input-with-icon";
import { Search } from "lucide-react";
import Pagination from "@/components/ui/pagination-custom";
import { getCookie } from "cookies-next/client";
import axios from "axios";
import { LoaderCircle, Plus } from "lucide-react";
import { Category, ListArticlesType } from "@/lib/types/DataArticlesType";
import moment from "moment";
import { useRouter } from "next/navigation";

function AdminArticlesPage() {
  const token = getCookie("token");
  const router = useRouter();
  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [perPage, setPerPage] = useState(9);
  const [loading, setLoading] = useState(true);
  // Dropdown options
  const [categoryOptions, setCategoryOptions] = useState<any[]>([]);
  //filter and search
  const [category, setCategory] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  //Data list articles
  const [listArticles, setListArticles] = useState<ListArticlesType[]>([]);

  //Get list articles
  const getArticles = useCallback(
    async (page: number) => {
      setLoading(true);
      const search = searchRef.current ? searchRef.current.value : "";
      const baseUrl = "https://test-fe.mysellerpintar.com/api/articles";
      const url = new URL(baseUrl);
      url.searchParams.set("page", page.toString());
      url.searchParams.set("limit", perPage.toString());
      url.searchParams.set("title", search);
      if (category === "all") {
        url.searchParams.set("categoryId", "");
      } else {
        url.searchParams.set("category", category || "");
      }

      await axios
        .get(url.toString(), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setLoading(false);
          setListArticles(response.data.data);
          setTotalElements(response.data.total);
          const limit = response.data.limit;
          const total = response.data.total;
          const result = total / limit;
          if (result <= 1) {
            setTotalPage(1);
          } else {
            setTotalPage(Math.floor(result) + 1);
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    [searchRef, currentPage, category]
  );

  //Get Category Options
  const getCategoryOptions = useCallback(async () => {
    const baseUrl = "https://test-fe.mysellerpintar.com/api/categories";
    let allCategory: Category[] = [];
    let currentPage = 1;
    let totalPages = 1;

    do {
      await axios
        .get(`${baseUrl}?page=${currentPage}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const data = response.data;

          allCategory = allCategory.concat(data.data);
          totalPages = data.totalPages;
          currentPage++;
        })
        .catch((err) => {});
    } while (currentPage <= totalPages);

    const categoryOptions = allCategory.map((category) => ({
      value: category.id,
      label: category.name,
    }));
    setCategoryOptions(categoryOptions);
  }, []);

  useEffect(() => {
    getArticles(currentPage);
    getCategoryOptions();
  }, [getArticles, searchRef, getCategoryOptions, category]);

  return (
    <>
      <div className="bg-white rounded-t-xl border border-gray-200 p-4 w-full font-semibold">
        Total Articles: {totalElements}
      </div>
      <div className="p-4 border border-gray-200 bg-white flex flex-row gap-4 items-center justify-between">
        <div className="flex flex-row gap-4 items-center">
          <Select onValueChange={(value) => setCategory(value)}>
            <SelectTrigger className=" bg-white text-black font-semibold">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup>
                <SelectItem value="all">All</SelectItem>
                {categoryOptions.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <InputWithIcon
            className="bg-white"
            startIcon={Search}
            ref={searchRef}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                getArticles(1);
              }
            }}
            placeholder="Search title"
          />
        </div>
        <button
          className="p-2 bg-primaryBlue rounded-lg text-white text-sm flex flex-row gap-2 items-center justify-center hover:bg-primaryBlue/80 transition-all duration-200 ease-in-out hover:cursor-pointer"
          onClick={() => {
            router.push("/admin/articles/add");
          }}
        >
          <Plus strokeWidth={2.5} /> Add Articles
        </button>
      </div>
      <Table className="w-full border border-gray-200">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center w-[200px]">Thumbnails</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Created at</TableHead>
            <TableHead className="text-center w-[200-px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white">
          {listArticles.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="flex items-center justify-center w-[200px]">
                <picture>
                  <img
                    src={
                      item.imageUrl
                        ? item.imageUrl
                        : "/image/default_article.png"
                    }
                    alt="Article Image"
                    width={100}
                    height={100}
                    className="object-cover h-[70px] w-[70px] rounded-lg"
                  />
                </picture>
              </TableCell>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.category.name}</TableCell>
              <TableCell>
                {moment(item.createdAt).local().format("MMMM D, YYYY HH:mm:ss")}
              </TableCell>
              <TableCell>
                <div className="flex flex-row gap-2 items-center justify-center">
                  <div
                    className="underline text-primaryBlue hover:cursor-pointer"
                    onClick={() => {
                      router.push(`/detail-article/${item.id}`);
                    }}
                  >
                    Preview
                  </div>
                  <div className="underline text-primaryBlue hover:cursor-pointer">
                    Edit
                  </div>
                  <div className="underline text-red-500 hover:cursor-pointer">
                    Delete
                  </div>
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

export default AdminArticlesPage;
