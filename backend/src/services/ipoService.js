const axios = require("axios");
const cheerio = require("cheerio");

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36";

const MONTHS = {
  Ocak: 0,
  Şubat: 1,
  Mart: 2,
  Nisan: 3,
  Mayıs: 4,
  Haziran: 5,
  Temmuz: 6,
  Ağustos: 7,
  Eylül: 8,
  Ekim: 9,
  Kasım: 10,
  Aralık: 11,
};

const parseIpoDate = (dateString) => {
  const match = dateString.match(
    /(\d{1,2})(?:-(\d{1,2}))?(?:-(\d{1,2}))?\s+(Ocak|Şubat|Mart|Nisan|Mayıs|Haziran|Temmuz|Ağustos|Eylül|Ekim|Kasım|Aralık)\s+(\d{4})/
  );

  if (!match) {
    return null;
  }

  const day = Number(match[1]);
  const month = MONTHS[match[4]];
  const year = Number(match[5]);

  return new Date(year, month, day);
};

const fetchIpos = async () => {
  const response = await axios.get("https://halkarz.com/", {
    headers: {
      "User-Agent": USER_AGENT,
    },
    timeout: 10000,
  });

  const $ = cheerio.load(response.data);

  const ipos = [];

  $("a").each((index, element) => {
    const link = $(element);

    const company = link.text().trim();
    const href = link.attr("href");

    if (
      !href ||
      !href.includes("halkarz.com/") ||
      !company ||
      company.length < 15
    ) {
      return;
    }

    if (
      href === "https://halkarz.com/" ||
      company === "Halka Arz Takvimi" ||
      company === "halkarz.com"
    ) {
      return;
    }

    const parent = link.parent().parent();

    const text = parent.text().replace(/\s+/g, " ").trim();

    const dateMatch = text.match(
      /(\d{1,2}(?:-\d{1,2})?(?:-\d{1,2})? (?:Ocak|Şubat|Mart|Nisan|Mayıs|Haziran|Temmuz|Ağustos|Eylül|Ekim|Kasım|Aralık) \d{4})/
    );

    if (!dateMatch) {
      return;
    }

    const symbolMatch = text.match(/\b[A-Z]{3,6}\b/);

    if (!symbolMatch) {
      return;
    }

    let status = "Taslak";

    if (text.includes("Talep toplanıyor")) {
      status = "Talep toplanıyor";
    } else if (text.includes("Talep toplama")) {
      status = "Talep toplama";
    } else if (text.includes("Ertelendi")) {
      status = "Ertelendi";
    } else if (text.includes("İptal Edildi")) {
      status = "İptal Edildi";
    } else if (text.includes("Tamamlandı")) {
      status = "Tamamlandı";
    }

    ipos.push({
      symbol: symbolMatch[0],
      company,
      dates: dateMatch[1],
      status,
      url: href,
    });
  });

  const uniqueIpos = Array.from(
    new Map(
      ipos.map((ipo) => [ipo.symbol, ipo])
    ).values()
  );

  // İstatistikler için TÜM IPO'lar
  const currentYear = new Date().getFullYear();

const thisYearIpos = uniqueIpos.filter((ipo) =>
  ipo.dates?.includes(String(currentYear))
);

const activeIpos = thisYearIpos.filter(
  (ipo) => ipo.status === "Talep toplanıyor"
);

const upcomingIpos = thisYearIpos.filter((ipo) => {
  const date = parseIpoDate(ipo.dates);

  return (
    date &&
    date > new Date() &&
    ipo.status !== "Tamamlandı" &&
    ipo.status !== "İptal Edildi"
  );
});

const completedIpos = thisYearIpos.filter(
  (ipo) => ipo.status === "Tamamlandı"
);

const stats = {
  thisYear: thisYearIpos.length,
  active: activeIpos.length,
  upcoming: upcomingIpos.length,
  completed: completedIpos.length,
};
console.log("IPO DATES:", uniqueIpos.map((ipo) => ({
  symbol: ipo.symbol,
  dates: ipo.dates,
  status: ipo.status
})));
  // Sadece son 10 IPO için detay sayfasından fiyat çek
  

  const iposWithPrice = await Promise.all(
    uniqueIpos.map(async (ipo) => {
      try {
        const companyResponse = await axios.get(
          ipo.url,
          {
            headers: {
              "User-Agent": USER_AGENT,
            },
            timeout: 10000,
          }
        );

        const companyPage = cheerio.load(
          companyResponse.data
        );

        let price = null;

        companyPage("body *").each(
          (index, element) => {
            const elementText = companyPage(element)
              .text()
              .trim();

            if (
              elementText.includes(
                "Halka Arz Fiyatı/Aralığı"
              ) &&
              elementText.length < 100
            ) {
              const parentText = companyPage(element)
                .parent()
                .text()
                .replace(/\s+/g, " ")
                .trim();

              const priceMatch = parentText.match(
                /(\d+(?:[.,]\d+)?\s*TL(?:\s*-\s*\d+(?:[.,]\d+)?\s*TL)?)/i
              );

              if (priceMatch) {
                price = priceMatch[1];
              }
            }
          }
        );

        console.log(
          `${ipo.symbol} fiyat:`,
          price
        );

        return {
          ...ipo,
          price,
        };
      } catch (error) {
        console.error(
          `${ipo.symbol} fiyat alınamadı:`,
          error.message
        );

        return {
          ...ipo,
          price: null,
        };
      }
    })
  );

  return {
    stats,
    ipos: iposWithPrice,
  };
};

module.exports = {
  fetchIpos,
};