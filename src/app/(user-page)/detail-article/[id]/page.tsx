"use client";
import React, { useState, useEffect, useCallback } from "react";
import { getCookie } from "cookies-next/client";
import { ListArticlesType } from "@/lib/types/DataArticlesType";
import { LoaderCircle } from "lucide-react";
import axios from "axios";
import { useParams } from "next/navigation";
import moment from "moment";
import { useRouter } from "next/navigation";

function DetailArticlePage() {
  const token = getCookie("token");
  const [loading, setLoading] = useState(true);
  const id = useParams().id as string;
  const router = useRouter();
  // Data article
  const [detailArticle, setDetailArticle] = useState<ListArticlesType | null>(
    null
  );
  const [otherArticle, setOtherArticle] = useState<ListArticlesType[]>([]);

  //Get Detail article
  const getDetailArticle = useCallback(async () => {
    setLoading(true);
    const baseUrl = `https://test-fe.mysellerpintar.com/api/articles/${id}`;
    await axios
      .get(baseUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setDetailArticle(response.data);
        setLoading(false);
      })
      .catch((error) => {});
  }, [id, token]);

  //Get Other articles
  const getOtherArticles = useCallback(async () => {
    setLoading(true);
    const baseUrl = `https://test-fe.mysellerpintar.com/api/articles?page=1&limit=3&exclude=${id}`;
    await axios
      .get(baseUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setOtherArticle(response.data.data);
        setLoading(false);
      })
      .catch((error) => {});
  }, [id, token]);

  useEffect(() => {
    getDetailArticle();
    getOtherArticles();
  }, [getDetailArticle, getOtherArticles]);
  return (
    <div className="w-screen min-h-screen bg-white">
      <div className="mt-20 px-6 md:px-12 lg:px-20 xl:px-32 2xl:px-40 mb-10">
        {loading ? (
          <div className="flex justify-center items-center h-45">
            <LoaderCircle className="animate-spin text-4xl text-primaryBlue " />
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center ">
              <div className="text-center text-sm font-semibold text-gray-500">
                {`${
                  detailArticle?.createdAt
                    ? moment(detailArticle.createdAt).format("LL")
                    : ""
                } · ${
                  detailArticle?.user.username
                    ? detailArticle.user.username
                    : ""
                }`}
              </div>
              <div className="text-black text-5xl text-center font-semibold max-w-[700px]">
                {detailArticle?.title ? detailArticle.title : ""}
              </div>
              <picture className="w-full max-h-[500px] mt-10 rounded-lg overflow-hidden object-center">
                <img
                  src={
                    detailArticle?.imageUrl
                      ? detailArticle.imageUrl
                      : "/image/default_article.png"
                  }
                  alt="Article Image"
                  loading="eager"
                />
              </picture>
              <div
                className="text-gray-500 text-lg font-medium mt-10  text-justify"
                dangerouslySetInnerHTML={{
                  __html: detailArticle?.content ? detailArticle.content : "",
                }}
              />
            </div>
            <div className="text-black text-lg font-bold mt-10">
              Other articles
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
              {otherArticle.map((item, index) => (
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
      </div>
    </div>
  );
}

export default DetailArticlePage;
