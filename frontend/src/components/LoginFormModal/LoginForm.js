// frontend/src/components/LoginFormModal/LoginForm.js
import React, { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import './LoginFormModal.css';
import { NavLink, useHistory } from "react-router-dom";

function LoginForm({close, toSignup}) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [emailValidationErrors, setEmailValidationErrors] = useState([]);
  const [passwordValidationErrors, setPasswordValidationErrors] = useState([]);
  const [showEmailErrors, setShowEmailErrors] = useState(false);
  const [showPasswordErrors, setShowPasswordErrors] = useState(false);

  useEffect(()=> {
    const errors = [];
    if (!email.length) errors.push('email is required');

    function ValidateEmail(email) {
      var mailformat = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
      if (email.match(mailformat)) {
        return true;
      }
      else {
        return false;
      }
    }

   if (!ValidateEmail(email)) errors.push('Email has invalid format');
   setEmailValidationErrors(errors);
  }, [email]);

  useEffect(() => {
    const errors = [];
    if (!password.length) errors.push('Password is required');
    setPasswordValidationErrors(errors);
  }, [password])

  const readyToSubmit = emailValidationErrors.length === 0 && passwordValidationErrors.length === 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ email, password })).then(() => {close(); history.push('/');}).catch(
      async (res) => {
        const data = await res.json();
        if (Object.keys(data.errors).length > 0) {
          const err = Object.values(data.errors)
          setErrors(err);
        }
      }
    );
  };

  const handleDemo = (e) => {
    e.preventDefault();
    dispatch(sessionActions.login({email:"john.smith@gmail.com", password:'secret password'}))
    .then(() => {close(); history.push('/');})
  };


  return (
    <div className="Modal">
    <div className="LoginFormModalMain">
    <span onClick={close} className="close" title="Close Modal">&times;</span>
      <div>
        <svg viewBox="0 0 51 49" xmlns="http://www.w3.org/2000/svg" width="48" height="48" className="mb-2">
          <g fillRule="nonzero" fill="none">
            <path d="M43.982 31.499c.004 4.458-3.18 8.298-7.509 9.053a9.154 9.154 0 01-1.649.144c-.186-.002-.26.074-.318.246-.865 2.502-2.59 3.993-5.195 4.37-1.724.248-3.288-.218-4.659-1.304-.19-.152-.307-.154-.507-.01-1.603 1.156-3.401 1.668-5.365 1.548-3.831-.233-7.055-3.186-7.658-6.993-.041-.264-.086-.529-.09-.794-.004-.22-.087-.306-.296-.347a7.276 7.276 0 01-3.14-1.443c-1.71-1.349-2.735-3.11-2.974-5.29-.272-2.494.492-4.65 2.232-6.448.14-.144.149-.244.053-.414a7.043 7.043 0 01-.934-3.806c.128-3.375 2.457-6.164 5.698-6.854.375-.08.571-.229.736-.587 1.598-3.472 4.281-5.583 8.005-6.28 2.614-.49 5.08.035 7.369 1.392a.637.637 0 00.561.062c3.635-1.063 6.855-.29 9.589 2.332 1.617 1.55 2.503 3.511 2.765 5.749.057.489.083.983.047 1.474-.014.186.042.264.217.33 1.638.61 2.768 1.751 3.262 3.438.616 2.098.099 3.938-1.456 5.468-.135.132-.106.214-.03.347a9.087 9.087 0 011.246 4.617zm-16.217-.716c.001 1.897 1.209 3.573 2.921 4.143.858.286 1.743.421 2.642.461.641.028 1.282-.017 1.874-.315.466-.235.686-.622.665-1.139-.021-.52-.252-.908-.745-1.115a2.463 2.463 0 00-.527-.162c-.544-.098-1.09-.18-1.632-.288-.893-.18-1.267-.656-1.28-1.567-.01-.805.207-1.565.453-2.317.45-1.375 1.056-2.687 1.637-4.008.56-1.277 1.148-2.543 1.544-3.888.219-.738.323-1.478.124-2.242-.301-1.16-.99-1.936-2.178-2.16-1.088-.203-2.17-.227-3.153.427-.327.217-.642.165-.926-.088-.216-.192-.423-.395-.635-.592-1.003-.934-2.33-.98-3.406-.127-.435.344-.8.77-1.272 1.07-.422.267-.847.343-1.315.092-.444-.24-.905-.45-1.365-.66-.465-.212-.916-.474-1.44-.519-1.657-.142-3.39.851-4.122 2.36-.324.668-.589 1.362-.84 2.06-1.16 3.23-2.104 6.527-3.082 9.813-.437 1.471.08 2.919 1.315 3.713.963.62 2.018.772 3.11.441.886-.268 1.37-.987 1.71-1.794 1.125-2.676 2.139-5.399 3.212-8.097.295-.742.58-1.488.894-2.223.316-.741 1.225-.994 1.764-.502.33.3.416.7.384 1.127-.035.457-.21.878-.376 1.297-.698 1.78-1.409 3.555-2.11 5.333-.142.36-.295.717-.358 1.103-.107.663.153 1.25.69 1.484.549.239 1.118.278 1.687.07.662-.242 1.057-.764 1.362-1.367 1.047-2.073 2.085-4.15 3.131-6.224.484-.957.975-1.91 1.469-2.862.183-.353.398-.687.74-.907a.886.886 0 01.96-.032c.31.175.33.494.317.809-.007.17-.054.335-.118.492-.136.328-.263.66-.413.981-.87 1.846-1.753 3.684-2.615 5.534-.364.78-.742 1.564-.697 2.385zm12.203 13.601a2.267 2.267 0 00-2.24-2.25 2.27 2.27 0 00-2.277 2.262c-.005 1.228 1.03 2.269 2.254 2.27 1.241.002 2.261-1.027 2.263-2.282zM2.13 25.624c1.18.003 2.174-.992 2.17-2.171-.006-1.182-.978-2.162-2.148-2.165A2.141 2.141 0 000 23.456c.001 1.199.95 2.166 2.13 2.169zM28.564 1.36a2.148 2.148 0 10-.023 4.294c1.175.001 2.12-.949 2.122-2.135.003-1.192-.931-2.153-2.1-2.159zm17.468 13.422c-.006-.983-.837-1.819-1.816-1.826-.999-.007-1.845.845-1.839 1.85a1.815 1.815 0 001.815 1.809 1.815 1.815 0 001.84-1.833zM8.607 9.533c0 .923.713 1.648 1.622 1.649.921.001 1.636-.727 1.633-1.664a1.604 1.604 0 00-1.624-1.616c-.932.002-1.63.7-1.631 1.631zm17.04 38.076a1.397 1.397 0 00-1.391-1.405 1.39 1.39 0 00-1.412 1.404c.002.777.62 1.392 1.399 1.392.777 0 1.397-.613 1.403-1.391zm21.757-21.847c-.741-.006-1.384.642-1.378 1.389a1.365 1.365 0 001.357 1.344c.775.002 1.356-.574 1.358-1.346.002-.765-.593-1.382-1.337-1.387zM14.863 0a1.136 1.136 0 00-1.158 1.156c0 .651.51 1.158 1.162 1.154.634-.003 1.13-.512 1.13-1.159 0-.653-.489-1.148-1.134-1.151zm35.126 19.554c-.533-.006-1.015.475-1.022 1.019a1.029 1.029 0 001.025 1.033.998.998 0 001.008-1.01 1.023 1.023 0 00-1.011-1.042zM9.669 39.83a1.036 1.036 0 00-1.012-1.02c-.556-.004-1.014.468-1.01 1.042a1.004 1.004 0 001.019 1 1.02 1.02 0 001.003-1.022z" fill="#F64060"></path><path d="M28.001 30.434c.002 1.878 1.194 3.538 2.884 4.102.847.283 1.72.418 2.608.457.633.028 1.265-.017 1.85-.312.46-.232.676-.616.656-1.127-.021-.515-.249-.9-.736-1.105a2.426 2.426 0 00-.52-.16c-.537-.097-1.076-.179-1.61-.286-.882-.178-1.251-.65-1.263-1.551-.01-.798.203-1.55.446-2.294.444-1.363 1.042-2.661 1.616-3.97.553-1.265 1.133-2.518 1.524-3.85.216-.731.319-1.464.123-2.22-.298-1.148-.978-1.918-2.15-2.139-1.074-.202-2.142-.225-3.113.423-.323.214-.633.163-.913-.087-.214-.19-.418-.392-.627-.587-.99-.925-2.3-.97-3.363-.126-.429.341-.79.764-1.255 1.06-.417.264-.837.34-1.298.09-.439-.236-.893-.445-1.347-.653-.46-.21-.904-.47-1.422-.513-1.635-.141-3.347.842-4.068 2.337-.32.661-.582 1.348-.83 2.04-1.144 3.197-2.077 6.463-3.041 9.718-.433 1.456.077 2.89 1.297 3.676.95.613 1.992.765 3.07.437.874-.266 1.353-.977 1.687-1.776 1.111-2.651 2.112-5.347 3.17-8.019.292-.735.575-1.474.884-2.201.312-.734 1.21-.985 1.741-.497.325.297.41.693.379 1.116-.035.452-.208.869-.37 1.284-.69 1.763-1.392 3.52-2.084 5.281-.14.357-.292.71-.353 1.092-.106.656.15 1.238.681 1.47.542.236 1.104.276 1.665.07.653-.24 1.044-.757 1.344-1.355 1.034-2.052 2.059-4.11 3.091-6.163.477-.948.963-1.892 1.45-2.834.18-.35.393-.68.731-.898a.872.872 0 01.947-.032c.306.173.326.489.313.8a1.458 1.458 0 01-.117.488c-.134.325-.259.654-.407.972-.859 1.828-1.73 3.648-2.582 5.48-.359.773-.732 1.55-.688 2.362z" fill="#FFF"></path>
          </g>
        </svg>
      </div>
      <div className="login-form-demo-title">
      <h1 className="login-form-title">Log in</h1>
      <button className="login-form-demo-button" onClick={(e) => handleDemo(e)}>Demo User</button>
      </div>
      <div>
        <span>Not a member yet?</span>
        <NavLink to={'/signup'} className='login-form-signup-link' onClick={toSignup}>Sign Up</NavLink>
      </div>
      <form onSubmit={handleSubmit} className='login-form'>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}  style={{color: 'red'}}>{error}</li>
          ))}
        </ul>
        <div className="login-form-email">
        <label htmlFor="login-email">
          Email
          </label>
          <input
            type="text"
            id="login-email"
            value={email}
            onChange={(e) => {setEmail(e.target.value); setShowEmailErrors(true)}}
            required
          />
          <>
          {showEmailErrors && emailValidationErrors.map((error, idx) => (
            <li key={idx} style={{color: 'red'}}>{error}</li>
          ))}
        </>
        </div>
        <div className="login-form-password">
        <label htmlFor="login-password">
          Password
          </label>
          <input
            type="password"
            id="login-password"
            value={password}
            onChange={(e) => {setPassword(e.target.value); setShowPasswordErrors(true)}}
            required
          />
           <>
          {showPasswordErrors && passwordValidationErrors.map((error, idx) => (
            <li key={idx} style={{color: 'red'}}>{error}</li>
          ))}
        </>
        </div>
        <div>
      <label className="checkbox-label">
        <input type="checkbox" className="login-form-checkbox" />
        Keep me signed in
      </label>
    </div>
        <button disabled={!readyToSubmit} type="submit" className={readyToSubmit ?"login-form-button": "not-ready-to-login"}>Log In</button>
      </form>
    </div>
    </div>
  );
}

export default LoginForm;
