import React, { useEffect, useState } from "react";
type UserProps = {
  children?: React.ReactNode;
  name: string;
  age: number;
};

const User: ({}: UserProps) => JSX.Element = ({ name, age }) => {
  const [user, setUser] = useState<UserProps | null>(null);
  const handleAgeAdd = (): void => {
    if (user) {
      setUser({ ...user, age: user.age + 1 });
    } else {
      setUser({ name: "홍길동", age: 10 });
    }
  };
  useEffect(() => {
    setUser({ name, age });
  }, []);
  return (
    <div>
      <h2>
        User :{" "}
        {user ? (
          <span>
            {user.name}님의 나이는 {user.age}살 입니다.
          </span>
        ) : (
          "사용자 정보가 없습니다."
        )}
      </h2>
      <div>
        <button onClick={handleAgeAdd}>나이증가</button>
      </div>
    </div>
  );
};

export default User;
