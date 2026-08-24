import { getProducts } from "./products.functions";

export const SCORING_WEIGHTS = {
  SEGMENT: 100,
  PROBLEM: 50,
  NEED: 30,
  OPERATION: 10,
};

export async function recommendProductLogic(data: {
  businessSegment: string;
  mainProblem: string;
  specificNeed?: string | null;
  currentOperation?: string | null;
}) {
  const products = await getProducts();
  
  const results = products.map((product: any) => {
    let score = 0;
    let reasons: string[] = [];

    if (product.segment && product.segment.toLowerCase() === data.businessSegment.toLowerCase()) {
      score += SCORING_WEIGHTS.SEGMENT;
      reasons.push(`Solução específica para o segmento de ${product.segment}`);
    }

    const productProblem = product.problem || "";
    if (productProblem.toLowerCase().includes(data.mainProblem.toLowerCase()) || 
        data.mainProblem.toLowerCase().includes(product.slug.toLowerCase())) {
      score += SCORING_WEIGHTS.PROBLEM;
      reasons.push(`Atende diretamente ao problema de ${data.mainProblem}`);
    }

    if (data.businessSegment === "barbearia" && data.mainProblem === "agendamento" && product.slug === "barberia") {
      score += 50;
    }
    
    if (data.businessSegment === "pet_shop" && product.slug === "petflow") {
      score += 50;
    }

    if (data.mainProblem === "sites" && product.slug === "sites") {
      score += 150;
      reasons.push("Recomendação direta para Presença Digital & Sites Profissionais");
    }

    return {
      product,
      score,
      reason: reasons.join(". "),
    };
  }).sort((a: any, b: any) => b.score - a.score);

  const topMatch = results[0];
  const secondMatch = results[1];
  
  if (!topMatch || topMatch.score < 50) {
    return {
      status: "needs_review",
      message: "Entendemos parte do seu cenário, mas queremos indicar a solução certa para sua operação.",
      recommendations: []
    };
  }

  let confidence = "LOW";
  if (topMatch.score > 150) {
    if (!secondMatch || (topMatch.score - secondMatch.score) > 50) {
      confidence = "HIGH";
    } else {
      confidence = "MEDIUM";
    }
  }

  const recommendations = results.slice(0, 2).filter((r: any) => r.score > 50);

  return {
    status: "success",
    confidence,
    topMatch,
    recommendations,
  };
}
