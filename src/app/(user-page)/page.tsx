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
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { Search } from "lucide-react";
import Pagination from "@/components/ui/pagination-custom";
import { getCookie } from "cookies-next/client";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import { Category, ListArticlesType } from "@/lib/types/DataArticlesType";
import moment from "moment";
import { useRouter } from "next/navigation";

export default function Home() {
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

  //Helper
  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, totalElements);
  return (
    <div className="w-screen min-h-screen bg-white">
      <div>
        <Image
          src="/image/image_main.jpg"
          alt="Main Image"
          width={1000}
          height={500}
          className="object-cover w-full h-[500px]"
          priority
          quality={100}
          loading="eager"
        />
        <div className="bg-primaryBlue/80 w-screen h-[500px] absolute top-0 left-0 flex flex-col items-center justify-center">
          <div className="px-4">
            <div className="text-white mb-2 text-center">Blog Genzet</div>
            <div className="text-white text-5xl text-center font-semibold max-w-[700px]">
              The Journal : Design Resources, Interviews, and Industry News
            </div>
            <div className="text-white text-center text-2xl mt-6">
              Your daily dose of design insights!
            </div>
            <div className="bg-[#3B82F6] rounded-lg px-2 py-2 flex flex-col mt-4 w-full gap-1 md:flex-row">
              <Select onValueChange={(value) => setCategory(value)}>
                <SelectTrigger className=" bg-white">
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
          </div>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-45">
          <LoaderCircle className="animate-spin text-4xl text-primaryBlue " />
        </div>
      ) : (
        <>
          <div className="mx-4 md:mx-10 xl:mx-20 mt-6 mb-6">
            Showing: {start} - {end} of {totalElements} articles
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-4 md:mx-10 xl:mx-20">
            {listArticles.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg flex flex-col gap-2 overflow-hidden hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  router.push(`/detail-article/${item.id}`);
                }}
              >
                <div className=" rounded-b-lg">
                  <picture>
                    <img
                      src={
                        item.imageUrl
                          ? item.imageUrl
                          : "/image/default_article.png"
                      }
                      alt="Article Image"
                      className="object-cover h-[240px] w-full"
                    />
                  </picture>
                </div>
                <div className="text-gray-500 mt-2 font-medium text-sm">
                  {moment(item.createdAt).format("LL")}
                </div>
                <div className="text-lg font-semibold text-black">
                  {item.title}
                </div>
                <div className="font-medium text-gray-500">
                  {item.content.split(".")[0] + "."}
                </div>
                <div className="bg-primaryBlue/20 flex justify-center items-center rounded-2xl w-fit px-2">
                  <p className="text-primaryBlue text-sm">
                    {item.category.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <div className="mt-8 mb-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPage}
          totalElements={totalElements}
          onPageChange={(page: any) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}
