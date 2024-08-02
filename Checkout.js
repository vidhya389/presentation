import React, {useEffect , useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_CONFIG } from './constants';
import { v4 as uuidv4 } from 'uuid';
import './Checkout1.css';
import logo from './TPP.png';

const Checkout1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cart = location.state.cart;
  const [accessToken, setAccessToken] = useState('');
  const [consentId, setConsentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [accountBalances, setAccountBalances] = useState([]);
  const [showBalance, setShowBalance] = useState(false);
  const [showReferenceNumber, setShowReferenceNumber] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [installmentOptions, setInstallmentOptions] = useState([]);
  const [creditScore, setCreditScore] = useState(0);
  const [isEligible, setIsEligible] = useState(false);
  const [accountId, setAccountId] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      handleCalculate();
       setShowBalance(true);
    }, []);
 const handleViewBalanceClick = () => {
    setShowBalance(true);
    handleCalculate(); // Call the handleCalculate function to fetch the account balance
  };
   const handleCalculate = () => {
    setLoading(true); // Set loading to true when API request starts
    const { CLIENT_ID, CLIENT_SECRET, TOKEN_ENDPOINT } = API_CONFIG;

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const data = `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&scope=accounts`;

    fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers,
      body: data,
    })
      .then(response => response.json())
      .then(data => {
        setAccessToken(data.access_token)

        makeSecondApiCall(data.access_token)

        ;
      })
      .catch(error => console.error(error));
  };

  const makeSecondApiCall = (accessToken) => {
      console.log(accessToken);
      const idempotencyKey = uuidv4();
      const url = 'http://localhost:8080/https://ob.sandbox.natwest.com/open-banking/v3.1/aisp/account-access-consents';
      const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      };
      const data = {
      "Data": {
          "Permissions": [
          "ReadAccountsDetail",
          "ReadBalances",
          "ReadTransactionsCredits",
          "ReadTransactionsDebits",
          "ReadTransactionsDetail",
          "ReadAccountsBasic",
          "BillPayService"
          ]
        },
        "Risk": {}
      };

      fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(data => {
          const consentId = data.Data.ConsentId;
          console.log(data);
          const links = data.Links;
          const selfLink = links.Self;

          console.log(selfLink);



          makeThirdApiCall(consentId);
        })
        .catch(error => console.error(error));
    };

    const makeThirdApiCall = (consentId) => {
          console.log(consentId);
          const url = `${API_CONFIG.PROXY_URL}${API_CONFIG.AUTHORIZATION_ENDPOINT}?client_id=${API_CONFIG.CLIENT_ID}&response_type=code id_token&scope=openid accounts&redirect_uri=${encodeURIComponent(API_CONFIG.REDIRECT_URI)}&request=${consentId}&authorization_mode=AUTO_POSTMAN&authorization_result=APPROVED&authorization_username=${API_CONFIG.PSU_USERNAME}&authorization_account=*&state=ABC`;
          fetch(url, {
            method: 'GET',
          })
          .then(response => {
            if (response.ok) {
              return response.json();
            } else {
              return response.text();
            }
          })
          .then(data => {
               if (typeof data === 'string') {
                 // Handle HTML response
                 console.log('HTML response:', data);
               } else {
                 const redirectUri = data.redirectUri;
                 console.log('redirectUri: ', redirectUri);
                 const fragment = redirectUri.split("#")[1];
                 const params = fragment.split("&");

                 const code = params[0].split("=")[1];

                 console.log('code:', code);
                 // Use the idToken as needed
                  makeFourthApiCall(code, consentId);
               }
             })
             .catch(error => console.error(error));
           };
const makeFourthApiCall = (authorizationCode, consentId) => {
      const url = 'https://ob.sandbox.natwest.com/token';
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };
      const data = `client_id=${API_CONFIG.CLIENT_ID}&client_secret=${API_CONFIG.CLIENT_SECRET}&redirect_uri=${API_CONFIG.REDIRECT_URI}&grant_type=authorization_code&code=${authorizationCode}`;

      fetch(url, {
        method: 'POST',
        headers,
        body: data,
      })
      .then(response => response.json())
      .then(data => {
        const accessToken = data.access_token;
        console.log('Access Token:', accessToken);
        makeFifthApiCall(accessToken, consentId);
      })
      .catch(error => console.error(error));
    };

        const makeFifthApiCall = (accessToken, consentId) => {
              console.log('accessToken: '+accessToken);
              const url = 'http://localhost:8080/https://ob.sandbox.natwest.com/open-banking/v3.1/aisp/accounts';
              const headers = {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              };

             fetch(url, {
                method: 'GET',
                headers
              })
              .then(response => response.json())
              .then(data => {
                    console.log('Accounts:', data);
                    const accountId = data.Data.Account[0].AccountId;
                    console.log('Account: ', data.Data.Account[0].AccountId);
                    console.log(accountId);
                    setAccountId(accountId); // Update the accountId state
                    makeSixthApiCall(accessToken, accountId);
                     })

              .catch(error => console.error(error));

            };
    const makeSixthApiCall = (accessToken, accountId) => {

      setAccessToken(accessToken);
      const url = `http://localhost:8080/https://ob.sandbox.natwest.com/open-banking/v3.1/aisp/accounts/${accountId}/balances`;
      const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      };

     fetch(url, {
        method: 'GET',
        headers
      })
      .then(response => response.json())
      .then(data => {
            console.log('Balance:', data);
            setAccountBalances(data.Data.Balance);
      })

      .catch(error => console.error(error))
      .finally(() => {
              setLoading(false);
    });
    };

    const handlePayClick= () => {
         setLoading2(true); // Set loading to true when API request starts
        const { CLIENT_ID, CLIENT_SECRET, TOKEN_ENDPOINT } = API_CONFIG;

        const headers = {
          'Content-Type': 'application/x-www-form-urlencoded',
        };
        const data = `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&scope=accounts`;

        fetch(TOKEN_ENDPOINT, {
          method: 'POST',
          headers,
          body: data,
        })
          .then(response => response.json())
          .then(data => {
            setAccessToken(data.access_token)

            makeSecondPayCall(data.access_token)

            ;
          })
          .catch(error => console.error(error));
      };

    const makeSecondPayCall = (accessToken) => {
          console.log(accessToken);
          const idempotencyKey = uuidv4();
          const url = 'http://localhost:8080/https://ob.sandbox.natwest.com/open-banking/v3.1/aisp/account-access-consents';
          const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          };
          const data = {
          "Data": {
              "Permissions": [
              "ReadAccountsBasic",
              "BillPayService"
              ]
            },
            "Risk": {}
          };

          fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
          })
            .then(response => response.json())
            .then(data => {
              const consentId = data.Data.ConsentId;
              makeThirdPayCall(consentId);
            })
            .catch(error => console.error(error));
        };
    const makeThirdPayCall = (consentId) => {
              console.log(consentId);
              const url = `${API_CONFIG.PROXY_URL}${API_CONFIG.AUTHORIZATION_ENDPOINT}?client_id=${API_CONFIG.CLIENT_ID}&response_type=code id_token&scope=openid accounts&redirect_uri=${encodeURIComponent(API_CONFIG.REDIRECT_URI)}&request=${consentId}&authorization_mode=AUTO_POSTMAN&authorization_result=APPROVED&authorization_username=${API_CONFIG.PSU_USERNAME}&authorization_account=*&state=ABC`;
              fetch(url, {
                method: 'GET',
              })
              .then(response => {
                if (response.ok) {
                  return response.json();
                } else {
                  return response.text();
                }
              })
              .then(data => {
                   if (typeof data === 'string') {
                     // Handle HTML response
                     console.log('HTML response:', data);
                   } else {
                     const redirectUri = data.redirectUri;
                     console.log('redirectUri: ', redirectUri);
                     const fragment = redirectUri.split("#")[1];
                     const params = fragment.split("&");

                     const code = params[0].split("=")[1];

                     console.log('code:', code);
                     // Use the idToken as needed
                      makeFourthPayCall(code, consentId);
                   }
                 })
                 .catch(error => console.error(error));
               };

    const makeFourthPayCall = (authorizationCode, consentId) => {
          const url = 'https://ob.sandbox.natwest.com/token';
          const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
          };
          const data = `client_id=${API_CONFIG.CLIENT_ID}&client_secret=${API_CONFIG.CLIENT_SECRET}&redirect_uri=${API_CONFIG.REDIRECT_URI}&grant_type=authorization_code&code=${authorizationCode}`;

          fetch(url, {
            method: 'POST',
            headers,
            body: data,
          })
          .then(response => response.json())
          .then(data => {
            const accessToken = data.access_token;
            console.log('Access Token:', accessToken);
            makeFifthPayCall(accessToken, consentId);
          })
          .catch(error => console.error(error));
        };

        const makeFifthPayCall = (accessToken, consentId) => {
                  console.log('accessToken: '+accessToken);
                  const url = 'http://localhost:8080/https://ob.sandbox.natwest.com/open-banking/v3.1/aisp/accounts';
                  const headers = {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                  };

                 fetch(url, {
                    method: 'GET',
                    headers
                  })
                  .then(response => response.json())
                  .then(data => {
                        console.log('Accounts:', data);
                        const accountId = data.Data.Account[0].AccountId;
                        console.log('Account: ', data.Data.Account[0].AccountId);
                        console.log(accountId);
                        makeSixthPayCall(accessToken, accountId);
                         })

                  .catch(error => console.error(error));

                };

    const makeSixthPayCall = (accessToken, accountId) => {
          console.log('accessToken: '+accessToken);
          console.log('accountId: '+accountId);
          const url = `http://localhost:8080/https://ob.sandbox.natwest.com/open-banking/v3.1/aisp/accounts/${accountId}/payees`;
          const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          };

         fetch(url, {
            method: 'GET',
            headers
          })
          .then(response => response.json())
          .then(data => {
                console.log('Payees:', data);
                const payee = data.data[0].id;
               console.log('payee: ', data.data[0].id);
                console.log(payee);
                makeSeventhPayCall(accessToken, accountId, payee);
                 })

          .catch(error => console.error(error));

        };

        const makeSeventhPayCall = (accessToken, accountId, payee) => {
          console.log(accessToken);
          const cost = location.state.totalCost;
          const url = `http://localhost:8080/https://ob.sandbox.natwest.com/open-banking/v3.1/aisp/accounts/${accountId}/bill-pay-request`;
          const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          };
          const data = {
            "payeeId": payee,
             "amount" : cost
          };

          fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
          })
            .then(response => response.json())
            .then(data => {
            console.log('Result:', data);
          //const  referenceNumber = data.referenceNumber;
            setReferenceNumber(data.referenceNumber);
            setShowReferenceNumber(true);
            console.log(referenceNumber);

             })
            .catch(error => console.error(error))
            .finally(() => {
                              setLoading2(false);
                    });
        };

   return (
       <div className="checkout-container">
        <div className="logo-container">
             <img src={logo} alt="Logo" className="logo" />
           </div>
         <h1 className="heading">Payment !!</h1>
         <p className="total-cost">Total Cost: £{location.state.totalCost}</p>

         <button className="view-balance-btn">
           View Account Balance
         </button>
         {loading ? (
           <div className="loading-container">
             <p>Loading...</p>
             <div className="loader"></div>
           </div>
         ) : (
           showBalance && (
             <div className="balance-container">
               {accountBalances.length > 0 && (
                 <div>
                   <p>
                   Account ID: {accountId.slice(0, 2)}XXXX{accountId.slice(-4)}
                   </p>
                   <p>
                     {accountBalances[0].Amount.Amount}{" "}
                     {accountBalances[0].Amount.Currency}
                   </p>
                 </div>
               )}
             </div>
           )
         )}
         <p> {" "}</p>
         <button className="pay-btn" onClick={() => handlePayClick(accessToken, consentId)}>
           Pay
         </button>
         {loading2 ? (
           <div className="loading-container">
             <p>Loading...</p>
             <div className="loader"></div>
           </div>
         ) : (
           showReferenceNumber && (
             <div className="reference-number-container">
               <p>Reference Number: {referenceNumber}</p>
             </div>
           )
         )}
       </div>
     );
   };

export default Checkout1;