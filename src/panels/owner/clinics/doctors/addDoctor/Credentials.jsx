import React, { useState } from "react";
import "flatpickr/dist/flatpickr.css";
import IconLockDots from "../../../../../components/Icon/IconLockDots";
import IconEye from "../../../../../components/Icon/IconEye";
import IconCloseEye from "../../../../../components/Icon/IconCloseEye";

const Credentials = ({ input, setInput }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full">
      <div className="mt-4">
        <div className="text-lg font-bold pl-7 py-1 ltr:pr-[50px] rtl:pl-[50px]">
          Set Password
        </div>
      </div>

      <div>
        <form>
          <div className="p-8">
            <div>
              <label htmlFor="Email">Password</label>
              <div className="relative text-white-dark">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="form-input ps-10 pr-9 placeholder:text-white-dark"
                  value={input.password}
                  onChange={(e) =>
                    setInput({ ...input, password: e.target.value })
                  }
                />
                <span className="absolute start-4 top-1/2 -translate-y-1/2">
                  <IconLockDots fill={true} />
                </span>
                <span
                  title={showPassword ? "hide password" : "show password"}
                  className="absolute end-3 top-1/2 -translate-y-1/2 cursor-pointer select-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <IconEye /> : <IconCloseEye />}
                </span>
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="Email">Confirm Password</label>
              <div className="relative text-white-dark">
                <input
                  id="Confirm Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="confirmPassword"
                  className="form-input ps-10 pr-9 placeholder:text-white-dark"
                  value={input.confirmPassword}
                  onChange={(e) =>
                    setInput({ ...input, confirmPassword: e.target.value })
                  }
                />
                <span className="absolute start-4 top-1/2 -translate-y-1/2">
                  <IconLockDots fill={true} />
                </span>
                <span
                  title={showPassword ? "hide password" : "show password"}
                  className="absolute end-3 top-1/2 -translate-y-1/2 cursor-pointer select-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <IconEye /> : <IconCloseEye />}
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Credentials;
