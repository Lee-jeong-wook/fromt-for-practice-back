import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { UserInfo } from './UserInfo';
import { getCookie, setCookie, removeCookie} from './Cookies';

function App() {
  const [isMake, setIsMake] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [id, setId] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const makeToken = async () => {
    setIsMake(!isMake);
    await axios({
      url: 'http://localhost:3000/auth/make',
      method: 'post',
      data: {
        id: id,
        isAdmin: isAdmin
      }
    }).then((res:AxiosResponse)=>{
      console.log(res);
      const JWTtoken = res.data.token;
      setCookie("token", JWTtoken);
      setIsMake(false);
    })
  }
  const authToken = async () => {
    let token = getCookie("token");
    setIsAuth(!isAuth);
    try {
      await axios({
        url: 'http://localhost:3000/auth/check',
        method: 'post',
        headers: {
          authorization: token
        }
      }).then((res:AxiosResponse<UserInfo>)=>{
        const userInfo = res.data.isAdmin;
        console.log(userInfo);
        userInfo ? alert("관리자입니다") : alert("관리자가 아닙니다");
      })
    } catch (error) {
      if(axios.isAxiosError(error)){
        if(error.response?.status === 401){
          alert("토큰이 존재하지 않습니다");
        } else if (error.response?.status === 419){
          alert("토큰이 만료되었습니다");
        }
      }
    } finally{
      setIsAuth(false);
    }

  }
  const deleteToken = () => {
    setIsDelete(!isDelete);
    try {
      removeCookie("token");
    } catch (error) {
      alert("쿠키 삭제 실패")
    } finally{
      setIsDelete(!isDelete);
    }
  }
  const isAdminHandler = () => {
    setIsAdmin(true)
  }
  const changeHandler = (e:React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target;
    setId(value);
  }

  return (
    <div className="App">
      <input type="text" 
      onChange={changeHandler}
      />
      <button onClick={isAdminHandler}>어드민 체크</button>
      <div>
        <button
        onClick={makeToken}
        >토큰 발급</button>
        <span>
          {
            isMake ? "발급중" : ""
          }
        </span>
      </div>
      <div>
        <button
        onClick={authToken}
        >토큰 인증</button>
          {
            isAuth ? "인증중" : ""
          }
      </div>
      <div>
        <button
        onClick={deleteToken}
        >토큰 삭제</button>
          {
            isDelete ? "삭제중" : ""
          }
      </div>
    </div>
  );
}

export default App;
