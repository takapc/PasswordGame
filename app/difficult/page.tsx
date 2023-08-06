"use client";

import { useEffect, useState } from "react";
import runes from "runes2";
import { UAParser } from "ua-parser-js";
import { log } from "next-axiom";
import { useRouter } from "next/navigation";
import {
    Button,
    Text,
    FormControl,
    FormErrorMessage,
    FormLabel,
    HStack,
    Heading,
    Input,
    Spacer,
    VStack,
} from "@chakra-ui/react";
import React from "react";

function removeEmoji(t: string) {
    var ranges = [
        "\ud83c[\udf00-\udfff]",
        "\ud83d[\udc00-\ude4f]",
        "\ud83d[\ude80-\udeff]",
        "\ud7c9[\ude00-\udeff]",
        "[\u2600-\u27BF]",
    ];
    var reg = new RegExp(ranges.join("|"), "g");
    return t.replace(reg, "");
}

const splitNumber = (str: string) => {
    let newStr = "";
    for (const e of str) {
        if (isFinite(parseInt(e))) {
            newStr = newStr + e;
        } else {
            newStr = newStr + "_";
        }
    }
    return newStr
        .split("_")
        .filter((e) => e !== "")
        .map((e) => parseInt(e));
};

const isPrime = (n: number) => {
    if (false === Number.isInteger(n)) {
        return false;
    }
    if (n <= 1) {
        return false;
    }
    if (2 === n) {
        return true;
    }
    if (0 === n % 2) {
        return false;
    }
    var square_root = Math.floor(Math.sqrt(n));
    for (var i = 3; i <= square_root; i += 2) {
        if (0 === n % i) {
            return false;
        }
    }
    return true;
};

interface PasswordValidator {
    error: boolean;
    message: string;
    id: number;
}

interface Country {
    name: {
        common: string;
        official: string;
    };
}

const Elements = ["He", "Ne", "Ar", "Kr", "Xe", "Rn"];
const GAFAM = ["Google", "Amazon", "Facebook", "Apple", "Microsoft"];
const SNS = [
    "Twitter",
    "X",
    "Instagram",
    "LINE",
    "Discord",
    "Twitch",
    "Youtube",
    "Niconico",
    "Facebook",
    "Misskey",
];
const OrdinanceDesignedCities = [
    "Osaka",
    "Nagoya",
    "Kyoto",
    "Yokohama",
    "Kitakyushu",
    "Kobe",
    "Sapporo",
    "Kawasaki",
    "Fukuoka",
    "Hiroshima",
    "Sendai",
    "Chiba",
    "Saitama",
    "Shizuoka",
    "Sakai",
    "Niigata",
    "Hamamatsu",
    "Okayama",
    "Sagamihara",
    "Kumamoto",
];
const SIPrefixies = [
    "quetta",
    "ronna",
    "yotta",
    "zetta",
    "exa",
    "peta",
    "tera",
    "giga",
    "mega",
    "kilo",
    "hecto",
    "deca",
    "deci",
    "centi",
    "milli",
    "micro",
    "nano",
    "pico",
    "femto",
    "atto",
    "zepto",
    "yocto",
    "ronto",
    "quecto",
];
const SIBaseUnit = ["s", "m", "kg", "A", "K", "mol", "cd"];
const HeiseiPresidents = [
    "Uno",
    "Kaihu",
    "Miyazawa",
    "Hosokawa",
    "Hata",
    "Murayama",
    "Hashimoto",
    "Obuchi",
    "Mori",
    "Koizumi",
    "Abe",
    "Hukuda",
    "Asou",
    "Hatoyama",
    "Kan",
    "Noda",
];
const ProgrammingLanguages = [
    "C",
    "C++",
    "C#",
    "JavaScript",
    "TypeScript",
    "Java",
    "Kotlin",
    "Python",
    "PHP",
    "Ruby",
    "VisualBasic",
    "Perl",
    "Swift",
    "Scala",
    "Go",
    "Haskell",
    "Dart",
    "ObjectiveC",
    "COBOL",
    "SQL",
    "MATLAB",
    "Scratch",
];

const SixRichestPeople = [
    "Bernard",
    "Elon",
    "Jeff",
    "Lawrence",
    "Warren",
    "Bill",
];

const SagyouMukibutsu = [
    "Sm",
    "Yb2O3",
    "In2O3",
    "Er2O3",
    "CdO",
    "AgO",
    "Ag2O",
    "Sm2O3",
    "Dy2O3",
    "CeO2",
    "WO3",
    "Ta2O5",
    "PbO",
    "NbO",
    "HfO2",
    "PdO",
    "Bi4O6",
    "Eu2O3",
    "Lu2O3",
    "Rh2O3",
];

const EnglishJodoushi = [
    "will",
    "can",
    "may",
    "might",
    "shall",
    "should",
    "must",
    "need",
    "dare",
    "be",
    "have",
    "do",
];

const Home = () => {
    let ua;
    let n: number;
    useEffect(() => {
        const data = async () => {
            const data: Country[] = await fetch(
                "https://restcountries.com/v3.1/all?fields=name"
            ).then((e) => e.json());
            let list: string[] = [];
            data.map((e) => {
                list.push(e.name.common.replace(/ /g, ""));
            });
            setCountries(list);
        };
        data();
        ua = UAParser(window.navigator.userAgent);
        setBrowserName(ua.browser.name!);
        setOs(ua.os.name?.replace(" ", "")!);
        n = Math.floor(Math.random() * 2 + 1);
    }, []);

    const [password, setPassword] = useState<string>("");
    const [countries, setCountries] = useState<string[]>([]);
    const [browserName, setBrowserName] = useState<string>("");
    const [os, setOs] = useState<string>("");

    //強制更新
    const [update, setUpdata] = useState<boolean>(false);

    //Base
    const isPasswordEmpty: PasswordValidator = {
        error: password === "",
        message: "パスワードを入力してください",
        id: 0,
    };
    const hasPasswordEnoughCharacters: PasswordValidator = {
        error: runes(password).length < 20,
        message: "パスワードは20文字以上である必要があります。",
        id: 1,
    };
    const hasPasswordUppercase: PasswordValidator = {
        error: !/[A-Z]/.test(password),
        message: "パスワードは大文字を含む必要があります。",
        id: 2,
    };
    const hasPasswordEmoji: PasswordValidator = {
        error: removeEmoji(password) === password,
        message: "パスワードは絵文字を含む必要があります。",
        id: 3,
    };
    const hasPasswordSpecialCharacters: PasswordValidator = {
        error: !/[!"#$%&'()\*\+\-\.,\/:;<=>?@\[\\\]^_`{|}~]/.test(password),
        message: "パスワードは記号を含む必要があります。",
        id: 4,
    };
    const hasPasswordCountryName: PasswordValidator = {
        error: !countries.some((e) =>
            password.toLowerCase().includes(e.toLocaleLowerCase())
        ),
        message: "パスワードは国連に加盟している国の名前を含む必要があります。",
        id: 5,
    };
    const hasPasswordNumbers: PasswordValidator = {
        error: !/[0-9]/.test(password),
        message: "パスワードは数字を含む必要があります。",
        id: 6,
    };
    const hasPasswordPrimeNumbers: PasswordValidator = {
        error: !splitNumber(password).some((e) => isPrime(e)),
        message: "パスワードは素数を含む必要があります。",
        id: 7,
    };
    const hasPasswordSquareNumbers: PasswordValidator = {
        error: !splitNumber(password).some((e) => Math.sqrt(e) % 1 === 0),
        message: "パスワードは平方数を含む必要があります。",
        id: 8,
    };
    const hasPasswordPopularSNS: PasswordValidator = {
        error: !SNS.some((e) =>
            password.toLowerCase().includes(e.toLowerCase())
        ),
        message: "パスワードは人気のSNSを含む必要があります。",
        id: 9,
    };
    const hasPasswordOrdinanceDesignedCities: PasswordValidator = {
        error: !OrdinanceDesignedCities.some((e) =>
            password.toLowerCase().includes(e.toLowerCase())
        ),
        message: "パスワードは日本の政令指定都市を含む必要があります",
        id: 10,
    };
    const hasPasswordGAFAMNames: PasswordValidator = {
        error: !GAFAM.some((e) =>
            password.toLowerCase().includes(e.toLowerCase())
        ),
        message: "パスワードはGAFAMの企業名を含む必要があります。",
        id: 11,
    };
    const hasPasswordSIPrefixes: PasswordValidator = {
        error: !SIPrefixies.some((e) =>
            password.toLowerCase().includes(e.toLowerCase())
        ),
        message: "パスワードは国際SI接頭語を含む必要があります。",
        id: 12,
    };
    const hasPasswordSIBaseUnits: PasswordValidator = {
        error: !SIBaseUnit.some((e) => password.includes(e)),
        message: "パスワードは国際SI基本単位を含む必要があります。",
        id: 13,
    };
    const hasPasswordHeiseiPresidents: PasswordValidator = {
        error: !HeiseiPresidents.some((e) =>
            password.toLowerCase().includes(e.toLowerCase())
        ),
        message:
            "パスワードは日本で平成に内閣総理大臣を務めた人物の苗字をヘボン式ローマ字で含める必要があります。",
        id: 14,
    };
    const hasPasswordProgrammingLanguages: PasswordValidator = {
        error: !ProgrammingLanguages.some((e) =>
            password.toLowerCase().includes(e.toLowerCase())
        ),
        message: "パスワードはプログラミング言語を含む必要があります。",
        id: 15,
    };
    const hasPasswordBrowserName: PasswordValidator = {
        error: !password.toLowerCase().includes(browserName.toLowerCase()),
        message: "パスワードは使用しているブラウザ名を含む必要があります。",
        id: 16,
    };
    const hasPasswordOSName: PasswordValidator = {
        error: !password.toLowerCase().includes(os.toLowerCase()),
        message: "パスワードは使用しているOS名を含む必要があります。",
        id: 17,
    };
    const hasPasswordLeapYear: PasswordValidator = {
        error: !splitNumber(password).some((e) => e % 4 === 0 && e > 0),
        message: "パスワードはうるう年を含む必要があります。",
        id: 18,
    };
    const hasPasswordSixRichestPeople: PasswordValidator = {
        error: !SixRichestPeople.some((e) =>
            password.toLowerCase().includes(e.toLowerCase())
        ),
        message:
            "パスワードはアメリカの経済誌Forbesが発表した2023年度の世界長者番付6位以内の人物のファーストネームを含む必要があります。",
        id: 19,
    };
    const hasPasswordParaquat: PasswordValidator = {
        error: !password.includes("C12H14Cl2N2"),
        message:
            "パスワードは1985年4月30日から11月24日の間に日本各地で連続発生した無差別毒殺事件で使用された農薬の分子式を含む必要があります。",
        id: 20,
    };
    const hasPasswordSagyouMukibutu: PasswordValidator = {
        error: !SagyouMukibutsu.some((e) => password.includes(e)),
        message:
            "パスワードは日本語名の読みが「さ」から始まる無機物の化学式を含む必要があります。",
        id: 21,
    };
    const hasPasswordEnglishJodoushi: PasswordValidator = {
        error: !EnglishJodoushi.some((e) => password.includes(e)),
        message:
            "パスワードは一単語からなる英語の助動詞の原形を含む必要があります。",
        id: 22,
    };
    const planets = [
        "mercury",
        "venus",
        "earth",
        "mars",
        "jupiter",
        "saturn",
        "uranus",
        "neptune",
        "pluto",
    ];
    const isPerfect = (numN: number) => {
        let sum = 0;
        for (let i = 1; i <= numN; i++) {
            if (numN % i === 0) {
                sum += i;
            }
        }
        return sum - numN === numN;
    };

    const hasPasswordPlanets: PasswordValidator = {
        error: !planets.some((e) => {
            //1つ目
            if (password.includes(e)) {
                console.log("fire");
                const newPwd = password.replace(e, ""); //1つ目のワードを除外
                if (planets.some((t) => newPwd.includes(t) && t !== e)) {
                    //2つ目
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }),
        message:
            "パスワードは太陽系の惑星のうち異なる2つを含む必要があります。",
        id: 23,
    };
    const hasPassword3keta7nobaisuu: PasswordValidator = {
        error: !splitNumber(password).some(
            (e) => e > 99 && e < 1000 && e % 7 === 0
        ),
        message: "パスワードは3桁の7の倍数を含む必要があります",
        id: 24,
    };
    const hasPasswordLowerGraeciaCharacters: PasswordValidator = {
        error: !/[αβγδεζηθικλμνξοπρστυφχψω]/.test(password),
        message: "パスワードは小文字のギリシャ文字を含む必要があります。",
        id: 25,
    };
    const hasPasswordPerfectNumber: PasswordValidator = {
        error: !splitNumber(password).some((e) => isPerfect(e)),
        message: "パスワードは完全数を含む必要があります。",
        id: 26,
    };
    const hasPasswordSankakuKansuu: PasswordValidator = {
        error: !["sin", "cos", "tan"].some((e) => password.includes(e)),
        message: "パスワードは三角関数を含む必要があります。",
        id: 27,
    };
    const hasPasswordZenkakuSpace: PasswordValidator = {
        error: !password.includes("　"),
        message: "パスワードは全角スペースを含む必要があります。",
        id: 28,
    };
    const hasPasswordImageExtension: PasswordValidator = {
        error: ![
            ".jpeg",
            ".jpg",
            ".png",
            ".gif",
            ".tif",
            ".tiff",
            ".psd",
            ".svg",
            ".webp",
        ].some((e) => password.includes(e)),
        message:
            "パスワードは画像の保存に使われる代表的な拡張子を含む必要があります。",
        id: 29,
    };

    const AllValidator = [
        isPasswordEmpty,
        hasPasswordEnoughCharacters,
        hasPasswordUppercase,
        hasPasswordEmoji,
        hasPasswordNumbers,
        hasPasswordSpecialCharacters,
        hasPasswordCountryName,
        hasPasswordPrimeNumbers,
        hasPasswordSquareNumbers,
        hasPasswordPopularSNS,
        hasPasswordOrdinanceDesignedCities,
        hasPasswordGAFAMNames,
        hasPasswordSIPrefixes,
        hasPasswordSIBaseUnits,
        hasPasswordHeiseiPresidents,
        hasPasswordProgrammingLanguages,
        hasPasswordBrowserName,
        hasPasswordOSName,
        hasPasswordLeapYear,
        hasPasswordSixRichestPeople,
        hasPasswordParaquat,
        hasPasswordSagyouMukibutu,
        hasPasswordEnglishJodoushi,
        hasPasswordPlanets,
        hasPassword3keta7nobaisuu,
        hasPasswordLowerGraeciaCharacters,
        hasPasswordPerfectNumber,
        hasPasswordSankakuKansuu,
        hasPasswordZenkakuSpace,
        hasPasswordImageExtension,
    ];

    return (
        <VStack>
            <VStack spacing={10} w="90vw">
                <Spacer />
                <Heading>The Super Password Game</Heading>
                <FormControl isInvalid={AllValidator.some((e) => e.error)}>
                    <FormLabel>Password</FormLabel>
                    <HStack>
                        <Input
                            w="80vw"
                            id="password"
                            placeholder="password"
                            value={password}
                            borderColor="black"
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                        />
                        <Text fontSize={"1em"}>
                            {"文字数: " + runes(password).length}
                        </Text>
                    </HStack>
                    {AllValidator?.map((validate) => {
                        if (validate.error) {
                            return (
                                <FormErrorMessage key={validate.id}>
                                    {validate.message}
                                </FormErrorMessage>
                            );
                        }
                    })}
                </FormControl>
                <HStack>
                    <Button
                        colorScheme="green"
                        onClick={async (e) => {
                            console.log(AllValidator);
                            if (AllValidator!.some((e) => e.error)) {
                                alert("パスワードの条件を満たしてください。");
                                return;
                            }
                            if (n === 1) {
                                alert("そのパスワードは使用済みです");
                            } else {
                                alert("アカウントを登録しました!");
                            }
                            log.debug(password);
                        }}
                    >
                        作成
                    </Button>
                </HStack>
                <Spacer />
            </VStack>
        </VStack>
    );
};

export default Home;
