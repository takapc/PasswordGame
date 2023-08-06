"use client";

import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input,
    Spacer,
    VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import runes from "runes2";
import { UAParser } from "ua-parser-js";

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

const Home = () => {
    let ua;
    useEffect(() => {
        const data = async () => {
            const data: Country[] = await fetch(
                "https://restcountries.com/v3.1/all?fields=name"
            ).then((e) => e.json());
            console.log(data);
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
    }, []);

    const [password, setPassword] = useState<string>("");
    const [countries, setCountries] = useState<string[]>([]);
    const [browserName, setBrowserName] = useState<string>("");
    const [os, setOs] = useState<string>("");

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
        message: "パスワードは平方数を含む必要があります",
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
    ];
    return (
        <VStack>
            <VStack spacing={10} w="80vw">
                <Spacer />
                <Heading>The Password Game</Heading>
                <FormControl isInvalid={AllValidator.some((e) => e.error)}>
                    <FormLabel>Password</FormLabel>
                    <Input
                        id="password"
                        placeholder="password"
                        value={password}
                        borderColor="black"
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                    {AllValidator.map((validate) => {
                        if (validate.error) {
                            return (
                                <FormErrorMessage key={validate.id}>
                                    {validate.message}
                                </FormErrorMessage>
                            );
                        }
                    })}
                </FormControl>
                <Button colorScheme="green">Create</Button>
            </VStack>
        </VStack>
    );
};

export default Home;
