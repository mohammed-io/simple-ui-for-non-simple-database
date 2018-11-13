import Document, { Head, Main, NextScript } from "next/document";

export default class App extends Document {
  render() {
    return (
      <html>
        <Head>
          <meta
            key="viewport"
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta key="httpEquiv" httpEquiv="X-UA-Compatible" content="ie=edge" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
