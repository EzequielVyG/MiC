import { GetSessionParams, getSession } from "next-auth/react";
import { getCsrfToken } from "next-auth/react";

export default function IndexPage() {
  return null;
}

export const getServerSideProps = async (
  context: GetSessionParams | undefined
) => {
  const session = await getSession(context);
  // if (!session || new Date(session.expires) < new Date())
  //   return {
  //     redirect: {
  //       destination: '/api/auth/signin',
  //       permanent: false,
  //     },
  //     props: {
  //       csrfToken: await getCsrfToken(context),
  //     },
  //   };

  return {
    props: {
      csrfToken: await getCsrfToken(context),
      session,
    },
    redirect: {
      destination: "/home",
    },
  };
};
