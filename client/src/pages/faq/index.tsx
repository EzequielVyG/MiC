import Accordion from "@/components/Accordion/Accordion";
import LoadingSpinner from "@/components/Loading/Loading";
import { Faq } from "@/features/Faqs/faq";
import { findAll } from "@/features/Faqs/hooks/useFindAllQuery";
import BasicLayout from "@/layouts/BasicLayout";
import MainLayout from "@/layouts/MainLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const FaqPage = () => {
  const [list, setList] = useState<JSX.Element[]>([]); 
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [openAccordionIndex, setOpenAccordionIndex] = useState(-1);
  const [faqs, setFaqs] = useState<Faq[]>([]); 

  const buttonLabels: Record<string, string> = {
    "/register": "Registrarse",
    "/mi_perfil": "Mi Perfil",
    "/auth/signin": "Recuperar contraseña",
    "/mi_perfil/change-password": "Cambiar contraseña",
  };

  useEffect(() => {
    async function fetchFaqData() {
      if (faqs.length === 0) {
        const someFaqs = await findAll();
        setFaqs(someFaqs);
      }

      const faqList = faqs.map((faqDato: Faq, i: number) => (
        <div key={i}>
          {" "}
          {faqDato.button_route ? (
            <Accordion
              question={faqDato.question}
              answer={faqDato.answer}
              nameButton={buttonLabels[faqDato.button_route]}
              onClick={() => {
                router.push(faqDato.button_route);
              }}
              isOpen={i === openAccordionIndex}
              onChange={(isOpen) => {
                setOpenAccordionIndex(isOpen ? i : -1);
              }}
            />
          ) : (
            <Accordion
              question={faqDato.question}
              answer={faqDato.answer}
              isOpen={i === openAccordionIndex}
              onChange={(isOpen) => {
                setOpenAccordionIndex(isOpen ? i : -1);
              }}
            />
          )}
          {i < faqs.length - 1 && <div style={{ marginBottom: "20px" }} />}
        </div>
      ));
      setList(faqList);
      setIsLoading(false);
    }

    fetchFaqData();
  }, [openAccordionIndex, faqs]);

  return (
    <div>
      <MainLayout>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <BasicLayout title="Preguntas frecuentes">
              <div style={{ maxWidth: "400px" }}>{list}</div>
            </BasicLayout>
          </>
        )}
      </MainLayout>
    </div>
  );
};

export default FaqPage;
