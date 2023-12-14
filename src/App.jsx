import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const App = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [mark, setMark] = useState(0);
  // console.log("mark", mark);
  const {
    data: quizzes,
    refetch: quizRefetch,
    isLoading: quizLoading,
  } = useQuery({
    queryKey: ["quizzes"],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_serverUrl}/quizzes?page=${currentPage}`
      );
      const data = await response.json();
      return data;
    },
  });

  const { data: quizcount = [] } = useQuery({
    queryKey: ["quizCount"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_serverUrl}/quizCount`
      );
      return res.data?.totalQuiz;
    },
  });
  const totalquiz = parseInt(quizcount);

  // console.log(quizzes);
  // console.log(totalquiz);

  // useEffect(() => quizRefetch(), [quizRefetch,currentPage]);
  useEffect(() => {
    quizRefetch();
  }, [quizRefetch, currentPage]);
  // console.log("currentPage", currentPage);

  // if (quizLoading)
  //   return (
  //     <div className="min-h-[10vh] flex justify-center items-center">
  //       <span className="loading loading-infinity loading-lg"></span>
  //     </div>
  //   );

  return (
    <div>
      <div className="min-h-screen flex flex-col max-w-[95vw] mx-auto md:max-w-[80vw]  lg:max-w-[50rem] justify-center">
        <div className="shadow-2xl p-5">
          <div className="text-center my-3 lg:text-3xl text-xl  font-bold underline  ">
            Welcome To React Quiz
          </div>
          {quizLoading ? (
            <div className="min-h-[10vh] flex justify-center items-center">
              <span className="loading loading-infinity loading-lg"></span>
            </div>
          ) : (
            <div>
              {quizzes?.map((quiz, index) => {
                // handle next and previous

                const handleNext = (quizName) => {
                  currentPage < totalquiz - 1
                    ? setCurrentPage(currentPage + 1)
                    : setCurrentPage(currentPage);
                  // console.log(quizName);
                  // console.log(quiz?.rightAnswer);
                  if (quizName === quiz?.rightAnswer) {
                    setMark(mark + 1);
                  }

                  if (currentPage + 1 === totalquiz) {
                    Swal.fire({
                      title: "Good job!",
                      text: `Quiz complete and total mark : ${mark}`,
                      icon: "success",
                    });
                  }
                };

                const handlePrevious = () => {
                  currentPage > 0
                    ? setCurrentPage(currentPage - 1)
                    : setCurrentPage(currentPage);
                  if (mark > 0) {
                    setMark(mark - 1);
                    console.log(mark);
                  }
                };
                // console.log(mark);
                // console.log(quiz);
                return (
                  <div key={index} className="card bg-base-100 ">
                    <div className="card-body">
                      <h2 className="lg:text-2xl text-xl font-semibold">
                        <span>No : {quiz?.quizNumber}</span> {quiz?.question}
                      </h2>
                      {quiz?.options.map((option, index) => {
                        return (
                          <p
                            className="btn"
                            onClick={() => handleNext(option)}
                            key={index}
                          >
                            {option}
                          </p>
                        );
                      })}

                      <div className="card-actions justify-start">
                        {currentPage === 0 ? (
                          ""
                        ) : (
                          <button
                            onClick={handlePrevious}
                            className="btn btn-primary mt-5"
                          >
                            previous
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;

// https://raw.githubusercontent.com/Nahid-Mahmud/mcq-game-react/main/public/quiz.json
