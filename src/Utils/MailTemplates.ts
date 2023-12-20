import { TemplateRequest } from "src/Types/Types"

export default function getTemplate(request: TemplateRequest, url: string, password?: string) {
  return `
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>${request === "reset" ? "Reset Password" : "Confirm Email Address"}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style type="text/css">
    @media screen {
      @font-face {
        font-family: 'Source Sans Pro';
        font-style: normal;
        font-weight: 400;
        src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
      }

      @font-face {
        font-family: 'Source Sans Pro';
        font-style: normal;
        font-weight: 700;
        src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
      }
    }

    body,
    table,
    td,
    a {
      -ms-text-size-adjust: 100%;
      /* 1 */
      -webkit-text-size-adjust: 100%;
      /* 2 */
    }

    table,
    td {
      mso-table-rspace: 0pt;
      mso-table-lspace: 0pt;
    }

    img {
      -ms-interpolation-mode: bicubic;
    }

    a[x-apple-data-detectors] {
      font-family: inherit !important;
      font-size: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
      color: inherit !important;
      text-decoration: none !important;
    }

    div[style*="margin: 16px 0;"] {
      margin: 0 !important;
    }

    body {
      width: 100% !important;
      height: 100% !important;
      padding: 0 !important;
      margin: 0 !important;
    }

    table {
      border-collapse: collapse !important;
    }

    a {
      color: #1a82e2;
    }

    img {
      height: auto;
      line-height: 100%;
      text-decoration: none;
      border: 0;
      outline: none;
    }
  </style>

</head>

<body style="background-color: #e9ecef;">

  <!-- Start Pre-Header -->
  <div class="preheader"
    style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
    ${request === "reset" ? "Password Reset Request" : "Confirm Your Email Address"}
  </div>
  <!--End Pre - Header-->

  <!--Body -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%">

    <!--Logo -->
    <tr>
      <td align="center" bgcolor="#e9ecef">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="center" valign="top" style="padding: 36px 24px;">
              <a href=${process.env.BASE_URL} target="_blank" style="display: inline-block;">
                <img src="https://i.postimg.cc/ZRWDHN7D/Logo-Black.png" alt="Logo" border="0" width="100"
                  style="display: block; width: 100px; max-width: 100px; min-width: 100px;">
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <!--Logo -->

    <!--Title -->
    <tr>
      <td align="center" bgcolor="#e9ecef">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="left" bgcolor="#ffffff"
              style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
              <h1
                style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px; text-align: center;">
                ${request === "reset" ? "Reset Your Password" : "Confirm Your Email Address"} </h1>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <!--Title -->

    <!--Content -->
    <tr>
      <td align="center" bgcolor="#e9ecef">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

          <!--Message -->
          <tr>
            <td align="left" bgcolor="#ffffff"
              style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
              <p style="margin: 0;"> Tap the button below to ${request === "reset" ? "Login with your new password" :
      "confirm your email address"}. <br> If you didn't make this request, you can safely delete this email.
              </p>
              <br>
              <p style="margin: 0;"> Your Temporary Password is: <b>${ password }</b>
            </td>
          </tr>
          <!--Message -->

          <!--Button -->
          <tr>
            <td align="left" bgcolor="#ffffff">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
                          <a href=${url} target="_blank"
                            style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">
                            ${request === "reset" ? "Login" : "Confirm Email"}
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!--Button -->

          <!--Link -->
          <tr>
            <td align="left" bgcolor="#ffffff"
              style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
              <p style="margin: 0;"> If that doesn't work, copy and paste the following
                link in your browser:</p>
              <p p style="margin: 0;"> <a href=${url} target="_blank"> ${url} </a></p>
            </td>
          </tr>
          <!--Link -->

          <!--Sign -->
          <tr>
            <td align="left" bgcolor="#ffffff"
              style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
              <p style="margin: 0;"> Money Keeper </p>
            </td>
          </tr>
          <!--Sign -->


        </table>
      </td>
    </tr>
    <!--Content -->

    <!--Footer -->
    <tr>
      <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

          <!--Advice -->
          <tr>
            <td align="center" bgcolor="#e9ecef"
              style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
              <p style="margin: 0;">
                You received this email because we received a request for 
                ${request === "reset" ? "a password reset" : "an account registration"} 
                with this email. <br>
                If you didn't make the request you can safely delete this email.</p>
            </td>
          </tr>
          <!--Advice -->

        </table>
      </td>
    </tr>
    <!--Footer -->

  </table>
  <!--Body -->

</body>

</html>
  `
}