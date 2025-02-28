import React from "react";
import { Typography } from "@mui/material";
import MyButton from "./Button";
import { useRouter } from "next/router";
import en from "@/locale/en";
import es from "@/locale/es";

type SignUpLinkProps = {
  onClick: () => void;
};

const SignUpLink: React.FC<SignUpLinkProps> = ({ onClick }) => {
  const router = useRouter();
  const { locale } = router;
  const t: any = locale === "en" ? en : es;

  return (
    <Typography variant="body2">
      {t.haveAccount}
      <MyButton sx={{ marginLeft: 2 }} color="primary" onClick={onClick}>
        {t.register}
      </MyButton>
    </Typography>
  );
};

export default SignUpLink;
