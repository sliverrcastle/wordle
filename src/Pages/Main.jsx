import React, { useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import Keyboard from "../components/Keyboard"; // 키보드 컴포넌트 import 추가
import { useRecoilState } from "recoil";
import wordList from "../system/words.json";
import { answerAtom } from "../atoms";
import Snackbar from "@mui/material/Snackbar";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { dateFormatter } from "../system/date";

const initialState = {
  attempts: Array(6).fill(""), // 사용자가 제출한 답 목록
  currentAttempt: "", // 현재 사용자가 입력하고 있는
  feedback: Array(6).fill(Array(5).fill("")), // 사용자가 제출한 답에 대한 feedback
  gameOver: false, // 게임 진행 상태
  keyStatus: {}, // 키보드
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case "SET_CURRENT_ATTEMPT": //지금 입력
      return { ...state, currentAttempt: action.payload };
    case "ADD_ATTEMPT": {
      // 답 제출
      const newAttempts = [...state.attempts];
      const attemptIndex = state.attempts.findIndex(
        (attempt) => attempt === ""
      );
      newAttempts[attemptIndex] = action.payload;
      const updatedFeedback = [...state.feedback];
      updatedFeedback[attemptIndex] = action.feedback;

      return {
        ...state,
        attempts: newAttempts,
        feedback: updatedFeedback,
        currentAttempt: "",
      };
    }
    case "SET_GAME_OVER": // 게임 끝남
      return { ...state, gameOver: true };
    case "UPDATE_KEY_STATUS": // 키보드 치는 중
      return { ...state, keyStatus: action.payload };
    default:
      return state;
  }
};

function Page() {
  const wordLength = 5;

  const [state, dispatch] = useReducer(gameReducer, initialState);

  const [answer, setAnswer] = useRecoilState(answerAtom);
  const [toast, setToast] = useState({ state: false, message: "" });
  const [openModal, setOpenModal] = useState(false);

  const updateKeyStatus = (currentAttempt, newFeedback) => {
    const updatedKeyStatus = { ...state.keyStatus };

    currentAttempt.split("").forEach((letter, index) => {
      const status = newFeedback[index];
      if (status === "correct") {
        updatedKeyStatus[letter] = "correct";
      } else if (
        status === "misplaced" &&
        updatedKeyStatus[letter] !== "correct"
      ) {
        updatedKeyStatus[letter] = "misplaced";
      } else if (status === "incorrect" && !updatedKeyStatus[letter]) {
        updatedKeyStatus[letter] = "incorrect";
      }
    });

    dispatch({ type: "UPDATE_KEY_STATUS", payload: updatedKeyStatus });
  };

  const handleKeyPress = (key) => {
    if (!state.gameOver) {
      if (key === "ENTER") {
        if (state.currentAttempt.length < wordLength) {
          setToast({
            state: !toast.state,
            message: "글자수는 5글자 입니다.",
          });
        } else if (state.currentAttempt.length === wordLength) {
          if (!wordList.includes(state.currentAttempt.toLowerCase())) {
            setToast({
              state: !toast.state,
              message: "유효하지 않은 단어입니다.",
            });
          } else {
            checkAnswer();
          }
        }
      } else if (key === "DELETE" || key === "BACKSPACE") {
        dispatch({
          type: "SET_CURRENT_ATTEMPT",
          payload: state.currentAttempt.slice(0, -1),
        });
      } else if (
        state.currentAttempt.length < wordLength &&
        /^[A-Z]$/.test(key)
      ) {
        dispatch({
          type: "SET_CURRENT_ATTEMPT",
          payload: state.currentAttempt + key,
        });
      }
    }
  };

  const checkAnswer = () => {
    if (state.currentAttempt.length === wordLength) {
      const newFeedback = state.currentAttempt
        .split("")
        .map((letter, index) => {
          if (letter === answer[index]) {
            return "correct";
          } else if (answer.includes(letter)) {
            return "misplaced";
          } else {
            return "incorrect";
          }
        });

      updateKeyStatus(state.currentAttempt, newFeedback);

      dispatch({
        type: "ADD_ATTEMPT",
        payload: state.currentAttempt,
        feedback: newFeedback,
      });

      if (
        state.currentAttempt === answer ||
        state.attempts.filter((attempt) => attempt === "").length === 1
      ) {
        dispatch({ type: "SET_GAME_OVER" });
      }
    }
  };

  const formatResult = (attempts, feedback, maxAttempts) => {
    const now = dateFormatter(new Date(), "yyyy-MM-dd HH:mm:ss");
    const attemptCount = attempts.filter((attempt) => attempt !== "").length;

    let result = `Wordle ${now} ${attemptCount}/${maxAttempts}\n\n`;

    feedback.forEach((attemptFeedback) => {
      result +=
        attemptFeedback
          .map((status) => {
            if (status === "correct") return "🟩";
            if (status === "misplaced") return "🟨";
            return "⬛";
          })
          .join("") + "\n";
    });

    return result;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Text copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  const handleCloseToast = () => {
    setToast({
      state: !toast.state,
      message: "",
    });
  };

  const handleCloseModal = () => {
    setOpenModal(!openModal);
  };

  const handleShare = () => {
    const result = formatResult(state.attempts, state.feedback, 6);
    copyToClipboard(result);
  };

  const getColor = (status) => {
    switch (status) {
      case "correct":
        return "#6aaa64";
      case "misplaced":
        return "#c9b458";
      case "incorrect":
        return "#787c7e";
      default:
        return "white";
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toUpperCase();
      handleKeyPress(key);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [state.currentAttempt, state.gameOver]);

  useEffect(() => {
    if (state.gameOver) {
      setOpenModal(!openModal);
    }
  }, [state.gameOver]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    const upperCaseWordList = wordList.map((item) => item.toUpperCase());
    const targetWord = upperCaseWordList[randomIndex];
    setAnswer(targetWord);
  }, []);

  return (
    <Wrapper>
      <Header>
        <Title>wordle</Title>
      </Header>
      <Content>
        {state.attempts.map((attempt, attemptIndex) => (
          <Flex key={attemptIndex}>
            {Array(wordLength)
              .fill("")
              .map((_, letterIndex) => {
                const status = state.feedback[attemptIndex][letterIndex];
                const isTyped =
                  attemptIndex ===
                    state.attempts.findIndex((attempt) => attempt === "") &&
                  state.currentAttempt[letterIndex];

                return (
                  <Box
                    key={letterIndex}
                    $backgroundColor={getColor(status)}
                    $color={isTyped ? "black" : "white"}
                    $border={isTyped ? "#878a8c" : getColor(status)}
                  >
                    {attempt[letterIndex] ||
                      (isTyped ? state.currentAttempt[letterIndex] : "")}
                  </Box>
                );
              })}
          </Flex>
        ))}

        <Keyboard
          onKeyPress={handleKeyPress}
          currentAttempt={state.currentAttempt}
          feedback={state.feedback[state.feedback.length - 1]}
          wordLength={wordLength}
          keyStatus={state.keyStatus}
        />
      </Content>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={toast.state}
        onClose={handleCloseToast}
        message={toast.message}
        key={"top" + "center"}
        autoHideDuration={3000}
      />

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalContent>
          <ModalTitle>게임이 종료되었습니다!</ModalTitle>
          <Flex>
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
            >
              다시하기
            </Button>
            <Button variant="outlined" onClick={handleShare}>
              공유하기
            </Button>
            <Button variant="outlined" onClick={handleCloseModal}>
              닫기
            </Button>
          </Flex>
        </ModalContent>
      </Modal>
    </Wrapper>
  );
}

export default Page;

const Header = styled.header`
  height: 66px;
  border-bottom: 1px solid #d3d6da;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  margin: 0;
  padding: 12px 0;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-flow: column;
`;

const Content = styled.div`
  margin: 30px 0;
`;
const Box = styled.div`
  width: 58px;
  height: 58px;

  border: 2px solid
    ${({ $border }) => ($border !== "white" ? $border : "#d3d6da")};
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 2rem;
  line-height: 1;
  font-weight: bold;
`;
const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin-bottom: 5px;
`;
const ModalContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  background-color: white;
  border: none;
  border-radius: 4px;
  padding: 20px;
  min-height: 200px;
`;

const ModalTitle = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;
