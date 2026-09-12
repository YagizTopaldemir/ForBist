const OpenAI = require("openai");

const {
  getPortfolio,
  getMarket,
  getStockPrice,
  getStockAnalysis,
  getInvestingFundamentals,
} = require("../tools/aiTools");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const tools = [
  {
    type: "function",
    function: {
      name: "get_portfolio",
      description:
        "Kullanıcının mevcut portföyünü, hisselerini, miktarlarını, ortalama maliyetlerini, güncel değerlerini ve kar zarar durumlarını getirir.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },

  {
    type: "function",
    function: {
      name: "get_market_summary",
      description:
        "BIST piyasasının güncel durumunu ve piyasa özetini getirir.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },

  {
    type: "function",
    function: {
      name: "get_stock_price",
      description:
        "Belirtilen hissenin güncel fiyat bilgilerini getirir.",
      parameters: {
        type: "object",
        properties: {
          symbol: {
            type: "string",
            description:
              "Hisse sembolü. Örneğin FROTO veya THYAO.",
          },
        },
        required: ["symbol"],
      },
    },
  },

  {
    type: "function",
    function: {
      name: "get_stock_analysis",
      description:
        "Belirtilen hissenin güncel piyasa verilerini getirir. Fiyat, değişim, önceki kapanış, ortalama, yüksek/düşük, hacim ve piyasa değerini içerir. Temel finansal oranları içermez.",
      parameters: {
        type: "object",
        properties: {
          symbol: {
            type: "string",
            description:
              "Analiz edilecek hisse sembolü.",
          },
        },
        required: ["symbol"],
      },
    },
  },

  {
    type: "function",
    function: {
      name: "get_investing_fundamentals",
      description:
        "Kullanıcı temel finansal oranları veya şirket değerlemesini sorduğunda Investing.com üzerinden BIST hissesinin temel finansal göstergelerini getirir. F/K, PD/DD, F/S, fiyat/nakit akışı ve mevcut diğer değerleme oranlarını içerir. Bu tool yalnızca temel finansal veri gerektiğinde kullanılmalıdır.",
      parameters: {
        type: "object",
        properties: {
          symbol: {
            type: "string",
            description:
              "Analiz edilecek BIST hisse sembolü. Örneğin FROTO veya THYAO.",
          },
        },
        required: ["symbol"],
      },
    },
  },
];

const chatWithAI = async (message, userId) => {
  const messages = [
    {
      role: "system",
      content: `
Sen ForBist'in AI finansal analiz asistanısın.

Görevin, kullanıcının portföyü ve BIST piyasası hakkında gerçek verilere dayanarak kısa, anlaşılır ve anlamlı finansal analizler yapmaktır.

KURALLAR:

1. GERÇEK VERİ

- Güncel fiyat, piyasa veya portföy bilgisi gerekiyorsa uygun tool'u kullan.
- Veriyi tahmin etme.
- Sayısal değerleri uydurma.
- Tool'da olmayan finansal metriği varmış gibi gösterme.
- Bir finansal veri mevcut değilse açıkça mevcut olmadığını belirt.

2. TOOL KULLANIMI

Portföy sorularında:
- get_portfolio kullan.

BIST piyasası sorularında:
- get_market_summary kullan.

Belirli bir hissenin sadece fiyatı soruluyorsa:
- get_stock_price kullan.

Belirli bir hisse hakkında genel veya kısa analiz isteniyorsa:
- get_stock_analysis kullan.

ÖNEMLİ:
get_stock_analysis yalnızca piyasa verilerini getirir.
Temel finansal oranları otomatik olarak getirmez.

Kullanıcı aşağıdaki bilgilerden birini açıkça soruyorsa:
- F/K
- PD/DD
- F/S
- FCF
- fiyat/nakit akışı
- net borç/EBITDA
- borçluluk
- değerleme oranları
- şirket pahalı mı?
- şirket ucuz mu?
- temel analiz
- bilanço veya finansal oranlar

get_investing_fundamentals kullan.

Kullanıcı temel finansal veri istemiyorsa:
- get_investing_fundamentals kullanma.
- Investing.com'dan gereksiz veri çekme.

3. HİSSE ANALİZİ

Hisse analizinde sadece rakamları listeleme.

Veriler arasındaki ilişkiyi yorumla.

Piyasa verileri mevcutsa:

- Güncel fiyatı değerlendir.
- Günlük değişimi değerlendir.
- Önceki kapanış ile mevcut fiyat arasındaki hareketi değerlendir.
- Hacim mevcutsa fiyat hareketiyle birlikte yorumla.
- Piyasa değerini gerektiğinde yorumla.
- Kısa vadeli riskleri belirt.
- Sektörel faktörleri gerektiğinde belirt.

Eğer get_investing_fundamentals kullanılmışsa:

- F/K oranını değerleme açısından değerlendir.
- PD/DD oranını şirketin değerlemesi açısından değerlendir.
- F/S veya diğer oranlar mevcutsa bunları değerlendir.
- Temel göstergeler ile fiyat hareketi arasındaki ilişkiyi yorumla.

Ancak get_investing_fundamentals kullanılmadıysa:
- F/K, PD/DD, F/S veya başka temel oranlar hakkında sayısal yorum yapma.
- Bu oranları tahmin etme.

Tool'da bulunmayan bilgileri varsayma.

4. GELECEK SENARYOLARI

Kesin tahmin yapma.

Şunları kullanma:

"Kesin yükselir."
"Kesin düşer."
"Kesin alınmalı."
"Kesin satılmalı."

Bunun yerine koşullu ifadeler kullan:

"Yukarı yönlü senaryoyu destekleyebilir."
"Değerleme açısından olumlu görünüyor."
"Düşüş riskini artırabilir."
"Bu koşullar devam ederse pozitif senaryo güçlenebilir."

5. PORTFÖY

Portföy analizinde:

- Ortalama maliyet
- Güncel fiyat
- Güncel değer
- Kâr/zarar
- Kâr/zarar yüzdesi
- Portföy yoğunlaşması
- Riskler

arasındaki ilişkiyi değerlendir.

Kullanıcının portföyünde olmayan hisseleri varmış gibi varsayma.

6. DİL

Kullanıcı Türkçe konuşuyorsa Türkçe cevap ver.

Gereksiz finans jargonundan kaçın.

7. CEVAP

Kullanıcı kısa analiz istiyorsa kısa ve yoğun cevap ver.

Detay istemiyorsa gereksiz uzun analiz yapma.

Rakamları sadece tekrar etmek yerine ne anlama geldiklerini açıkla.

Doğrudan sonuca gir.
`,
    },

    {
      role: "user",
      content: message,
    },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-5-mini",
    messages,
    tools,
    tool_choice: "auto",
  });

  const assistantMessage = response.choices[0].message;

  // Tool çağrısı yoksa direkt cevabı döndür
  if (!assistantMessage.tool_calls?.length) {
    return assistantMessage.content;
  }

  // Assistant'ın tool çağrısını conversation'a ekle
  messages.push(assistantMessage);

  // Tool'ları çalıştır
  for (const toolCall of assistantMessage.tool_calls) {
    const toolName = toolCall.function.name;

    let args = {};

    try {
      args = JSON.parse(
        toolCall.function.arguments || "{}"
      );
    } catch (error) {
      console.error(
        "Tool arguments parse error:",
        error
      );

      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify({
          error: "Tool parametreleri okunamadı.",
        }),
      });

      continue;
    }

    let result;

    try {
      switch (toolName) {
        case "get_portfolio":
          result = await getPortfolio(userId);
          break;

        case "get_market_summary":
          result = await getMarket();
          break;

        case "get_stock_price":
          result = await getStockPrice(args.symbol);
          break;

        case "get_stock_analysis":
          result = await getStockAnalysis(args.symbol);
          break;

        case "get_investing_fundamentals":
          result = await getInvestingFundamentals(
            args.symbol
          );
          break;

        default:
          result = {
            error: `Bilinmeyen tool: ${toolName}`,
          };
      }
    } catch (error) {
      console.error(
        `Tool error (${toolName}):`,
        error.message
      );

      result = {
        error: `${toolName} çalıştırılırken hata oluştu.`,
      };
    }

    console.log(
      `AI Tool: ${toolName}`,
      args,
      result
    );

    messages.push({
      role: "tool",
      tool_call_id: toolCall.id,
      content: JSON.stringify(result),
    });
  }

  // Tool sonuçlarından nihai cevabı üret
  const finalResponse =
    await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        ...messages,
        {
          role: "system",
          content: `
Tool sonuçlarını kullanarak kullanıcıya nihai cevabı ver.

Yeni tool çağrısı yapma.

Tool'da olmayan verileri uydurma.

Gerçek verileri sadece listeleme; aralarındaki ilişkiyi yorumla.

Hisse analizinde:

- Güncel fiyatı ve günlük değişimi değerlendir.
- Önceki kapanış ile fiyat hareketini değerlendir.
- Hacim mevcutsa fiyat hareketiyle birlikte yorumla.
- Piyasa değeri mevcutsa gerektiğinde değerlendir.
- F/K yalnızca tool sonucunda mevcutsa değerlendir.
- PD/DD yalnızca tool sonucunda mevcutsa değerlendir.
- F/S veya diğer temel oranlar yalnızca tool sonucunda mevcutsa değerlendir.
- Temel göstergeler ile fiyat hareketi arasındaki ilişkiyi yorumla.
- Şirketin sektörel risklerini belirt.
- Kısa vadeli riskleri belirt.
- Uzun vadeli fırsatları belirt.
- Pozitif ve negatif senaryoları koşullu şekilde ifade et.

ÖNEMLİ:

Eğer get_investing_fundamentals çağrılmadıysa
F/K, PD/DD, F/S, net borç/EBITDA veya başka
temel finansal oranlar hakkında sayı verme.

Bu verileri tahmin etme.

Eğer kullanıcı temel finansal oranları sormadıysa,
cevapta bu oranların eksikliğini gereksiz yere belirtme.
Kullanıcının istediği analize odaklan.

Kesin tahmin yapma.

"Kesin yükselir", "kesin düşer",
"kesin alınmalı", "kesin satılmalı"
gibi ifadeler kullanma.

Portföy analizinde:

- Ortalama maliyet
- Güncel fiyat
- Güncel değer
- Kâr/zarar
- Kâr/zarar yüzdesi
- Yoğunlaşma
- Riskler

arasındaki ilişkiyi değerlendir.

Kullanıcı kısa analiz istediyse kısa ve yoğun cevap ver.

Detay istemiyorsa gereksiz uzun açıklama yapma.

Doğrudan sonuca gir.
`,
        },
      ],
    });

  return finalResponse.choices[0].message.content;
};

module.exports = {
  chatWithAI,
};