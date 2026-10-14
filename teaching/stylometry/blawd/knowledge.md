# The lecture: "Who Wrote This? Fingerprints and Disguises in the Age of LLMs" (Haining Wang)
Each slide: what is on screen, then what the speaker says (notes).

---

## Slide 1 (cover)
On screen: Digital Humanities · Indiana University · Oct 15, 2026
 Who Wrote This?
 Fingerprints and disguises in the age of LLMs
 Haining Wang · Indiana University School of Medicine
Speaker notes: Hello, and thank you for having me. I am Haining Wang. I study how writing reveals its author, and how authors can protect themselves; I did my PhD here at Indiana University with Allen Riddell, and I recently wrote a book on defending against authorship identification. Today is in two parts.

---

## Slide 2 (agenda)
On screen: Today, in two parts
 Part 1
 Your writing has a fingerprint
 How readers, and then computers, recognize a writer
 · Two translators of Confucius
 · The Unabomber
 · The Lu Xun brothers
 · At scale: thousands of writers
 Part 2
 When the fingerprint becomes a threat
 Can you hide? And what changes when anyone can ask an AI?
 · Who needs to stay anonymous
 · Machine Zone vs. John Doe
 · Hiding by hand, with software
 · … and with LLMs
 Then: a hands-on lab you can run in your browser.
Speaker notes: Here is the plan. Part one: your writing has a fingerprint. We will see how readers, and then computers, recognize a writer, through three cases: two translators of Confucius, the Unabomber, and the Lu Xun brothers, and then what happens at the scale of thousands of writers. Part two flips sides: when that fingerprint becomes a threat, can you hide, and what changes now that anyone can ask an AI to rewrite their words? At the end, a hands-on lab. Let's start with a puzzle.

---

## Slide 3 (cold-open)
On screen: Part 1 · Your writing has a fingerprint
 Case 1: Two translators, one passage
 Lionel Giles
 • British
• translated in 1907
 Speaking to Tzŭ Lu , the Master said: Have you ever heard, Yu, of the six shadows which attend six several virtues?—No, he replied.—Sit down, then, and I will tell you. Love of goodness without the will to learn casts the shadow called foolishness. Love of knowledge without the will to learn casts the shadow called instability. Love of candour without the will to learn casts the shadow called rudeness. …
 Robert Eno
 • American
• translated in 2015
 The Master said, "Yóu, have you heard the six imperatives and the six related flaws of narrow vision?" Zilu replied, "No, I have not." "Sit, and I'll teach them to you. If you love ren, but you do not love learning, the flaw is ignorance. If you love knowledge but you do not love learning, the flaw is unruliness. … If you love valor but you do not love learning, the flaw is causing chaos."
 Highlighted: spelling (British candour vs. American valor ) and Chinese names (old-style Tzŭ Lu vs. modern pinyin Zilu ).
 Analects 17.8 · Giles, The Sayings of Confucius (1907); Eno, The Analects of Confucius (2015) · Lab chapter 1
Figures: Pixel-art Confucius bowing with hands clasped in greeting
Speaker notes: Live vote: Giles or Eno? Two scholars translated the same passage of Confucius. Lionel Giles was British and published his translation in 1907. Robert Eno is American and published his in 2015. You don't need to read every word; look at the highlighted ones. Giles writes "candour" with a "u", the British way; Eno writes "valor" without one, the American way. And they spell the same disciple's name differently: Giles uses the old system, "Tzŭ Lu"; Eno uses the modern one, pinyin, "Zilu". Same meaning, different habits. Keep those two habits in mind.

---

## Slide 4 (mystery-reveal)
On screen: Part 1 · Your writing has a fingerprint
 Who wrote this note: Giles or Eno?
 Shê was a district of the Ch‘u State, which Confucius visited in 488 B.C. The following anecdote, told by T‘an Kung , is a striking illustration of the above saying. Travelling with his disciples, the Master came across a woman weeping and wailing beside a grave, and inquired the cause of her grief. "Alas!" she replied. "My father-in-law was killed here by a tiger; after that, my husband; and now my son has perished by the same death."—"But why, then, do you not go elsewhere?"—"The government here is not harsh," answered the woman.—"There!" cried the Master, "remember that. Bad government is worse than a tiger."
 Hints are underlined: one spelling, three Chinese names.
 It's Giles.
 "Travelling": British double l, like his "candour". "Ch‘u", "T‘an Kung": the old style, like his "Tzŭ Lu".
 Note: Lionel Giles's own footnote, The Sayings of Confucius (1907)
Figures: Pixel-art Confucius bowing with hands clasped in greeting
Speaker notes: Pause for a vote, then click to reveal. Now here is a note that nobody signed. I've underlined four hints: one spelling, and three Chinese names. Pause the video, or raise your hand in class: Giles, or Eno? [click] It's Giles. "Travelling" with two l's is British; an American writes "traveling", just as Eno writes "valor". And "Ch'u" and "T'an Kung", with those little apostrophes, are in the old system Giles used for "Tzŭ Lu"; Eno would have written pinyin. In fact, this is one of Giles's own footnotes. What you just did has a name: impressionistic stylometry. A careful reader notices habits the writer never thinks about. It sounds simple, but it works: for centuries, this is how literary scholars and forensic linguists worked. Of course, this was a made-up puzzle. Next, a real case, with lives at stake.

---

## Slide 5 (unabomber-story)
On screen: Part 1 · Your writing has a fingerprint
 Case 2: The Unabomber
 From 1978 to 1995, someone sent 16 bombs, killing 3 people and injuring 23, and was never seen. In 1995 he offered a deal: publish my 35,000-word essay and I will stop. On September 19, 1995, the Washington Post printed it, with the New York Times sharing the cost.
 Facts: Turchie search-warrant affidavit (Apr 3, 1996); The Washington Post (Sept 19, 1995) · illustrations generated from the historical record, not TV stills
Figures: Pixel-art illustration of a small wooden cabin in snowy Montana pine woods at dusk | Pixel-art illustration of an opened newspaper special section dated Sept. 19, 1995
Speaker notes: Verified: first device May 25, 1978 (Chicago area); last Apr 24, 1995 (Sacramento). 16 bombs, 3 deaths, 23 injuries. The papers' publishers decided to print; Attorney General Reno and FBI Director Freeh recommended it for public safety. Ask: who has seen the series "Manhunt"? Then: the series takes liberties, so here is the record.

---

## Slide 6 (unabomber-caught)
On screen: Part 1 · Your writing has a fingerprint
 How he was caught: his family read it
 David Kaczynski and his wife Linda read the manifesto and feared it was David's brother, Ted. In February 1996 they went to the FBI with Ted's old letters and an essay he wrote in 1971. Agents compared them by hand. Ted was arrested at his Montana cabin on April 3, 1996.
 Over 160 similarities , found by careful reading: ideas, phrases, spellings.
 Turchie search-warrant affidavit, Apr 3, 1996, ¶95, ¶108–112
Figures: Pixel-art illustration of two people at a kitchen table at night reading a newspaper, a box of old letters beside them | Pixel-art illustration of two typed documents labelled 1971 and 1995 with matching lines highlighted and connected
Speaker notes: So how was he caught? Not by a computer. By his family. David Kaczynski's wife, Linda, read the manifesto and thought it sounded familiar. David read it and feared it was his older brother, Ted. In February 1996, through a lawyer, they went to the FBI. They brought 86 of Ted's letters and an essay Ted had written in 1971 that made much the same argument. FBI agents laid the documents side by side and compared them by hand. On April 3, 1996, Ted Kaczynski was arrested at his cabin in Montana. The comparison listed over 160 similarities, in ideas, in phrases, in spelling. That is careful, expert reading, and it worked. So what exactly did the readers notice?

---

## Slide 7 (ted-idiolect)
On screen: Part 1 · Your writing has a fingerprint
 Not one word, but a combination of habits
 A twisted idiom
 "you can't eat your cake and have it too"
 In the manifesto, and in a letter to his mother. Most people say "have your cake and eat it".
 A pet phrase
 "cool-headed logician"
 His brother David recognized it as Ted's own way of talking.
 Uncommon spellings
 analyse · wilfully · licence · instalment
 British-style spellings from an American writer, in both sets of documents.
 These are just three of the 160+ similarities the FBI listed. Together, such habits form an idiolect : one person's way of writing. Careful readers spot the striking ones; computers count the quiet ones. The two work best together.
 Turchie search-warrant affidavit, Apr 3, 1996: ¶105 (cool-headed logician), ¶114 (spellings), ¶199–200 (cake idiom)
Speaker notes: So what did the readers notice? Three kinds of things. First, a twisted idiom: the manifesto says "you can't eat your cake and have it too", and a letter Ted wrote to his mother says "we can't eat our cake and have it too". Most of us say it the other way round. Second, a pet phrase: "cool-headed logician". When his brother David read the manifesto, that phrase leapt out at him as Ted's own terminology. Third, spellings: "analyse", "wilfully", "licence", "instalment", British-style spellings from an American, the same kind of clue as "travelling" in our first case. Any one of these could be a coincidence. But English gives every writer many ways to say the same thing, and each of us keeps picking the same combination: the same words, the same order, the same spellings. That combination is called an idiolect, and it is what authorship detectives look for. And these are just three examples: the FBI's comparison listed over 160, and there are many more small habits that work the same way. A careful human reader is very good at spotting the striking ones, like a twisted idiom. A computer is good at something else: counting the quiet ones, the small words nobody notices. The two are partners, not rivals. So let's see what counting adds.

---

## Slide 8 (ted-count)
On screen: Part 1 · Your writing has a fingerprint
 From noticing to counting
 Count small words and compare with 19 other anti-technology writers: on these four, Ted's 1971 essay and the manifesto sit together, outside everyone else.
 Our re-analysis: Ted's 1971 essay (6,331 words), the manifesto (30,546), 19 writers from the Ted K Archive · Lab chapter 2
Figures: Dot plot of four words per 1,000 words. 'because' and 'any': Ted's 1971 essay and the manifesto are higher than all 19 other writers. 'and' and 'the': both are lower than all 19.
Speaker notes: A human reader notices a twisted idiom. A computer can do something humans are bad at: count. Let's count the small words everyone uses, like "because", "any", "and", "the", and compare Ted with 19 other people who wrote essays against modern technology in the same decades. Each grey dot is one of those writers. The blue diamond is Ted's 1971 essay; the orange star is the manifesto. Look at "because": Ted, in 1971 and in 1995, uses it more than every one of the other 19. He argues; he gives reasons. "Any": the same. And "and" and "the": he uses them less than every one of them. No single word proves anything. But these are words nobody chooses on purpose, and the essay and the manifesto keep landing in the same unusual corner. (For honesty: I picked these four to show you; the computer on the next slide uses about two hundred small words at once, without picking.)

---

## Slide 9 (unabomber-computer)
On screen: Part 1 · Your writing has a fingerprint
 Let the computer decide
 ① It reads
 ■ Ted's 1971 essay 
 about 6,300 words · labelled "Ted" 
 ● 19 other anti-tech writers 
 same topics, same decades · labelled "not Ted" 
 ↓ learns which small-word habits are Ted's ↓
 ② It scores texts it never saw
 ● other writers' texts, held back
 ◆ Ted's later essays, 1999–2016
 ★ the manifesto
 Each dot is one whole text. The alarm line lets through only 2 of the 29 other writers' texts.
 Our re-analysis: ~200 small words + logistic regression · try it yourself in Lab chapter 2
Figures: Three rows, one dot per whole text, scored by how Ted-like it is, with an alarm line. Other writers' texts the computer never saw: 2 of 29 flagged. Ted's later essays (known Ted, a check): 7 of 8 flagged. The manifesto (the question): flagged, far to the right.
Speaker notes: Now let the computer do it, with all two hundred small words at once: the, of, which, because, and so on. On the left is what it reads. Ted's 1971 essay, labelled "Ted". And texts by nineteen other writers who attacked technology in the same decades, Ellul, Mumford, Illich, Postman and others, labelled "not Ted". They wrote about the same topics, so topic gives nothing away; only the small words can. From these examples the computer learns which small-word habits are Ted's. Then we give it texts it has never seen, and it scores each one: how Ted-like is it? We never tell it who wrote what. Each dot on the right is one whole text. The dashed line is the alarm: right of it, the computer says "this is Ted." Top row, other writers' texts it never saw: almost all stay left, only two of twenty-nine cross. Middle row, essays Ted wrote decades later in prison. We know these are Ted, so this is our check, and seven of eight cross. The computer knows Ted when it sees him. Bottom row, the manifesto: far to the right. The computer points at Ted. In 1996 the FBI compared these texts by hand. Today a computer does it in seconds, and you will do it yourself in lab chapter 2. [Later essays used: Morality and Revolution (1999); Hit Where It Hurts, The System's Neatest Trick, The Coming Revolution (2002); The Road to Revolution (2008); Afterthoughts (2010); Why the Technological System Will Destroy Itself (2011); Anti-Tech Revolution, ch. 1 (2016).]

---

## Slide 10 (duying)
On screen: Part 1 · Your writing has a fingerprint
 Case 3: The Lu Xun brothers
 To trace how a thinker's ideas grew, you first need to know which texts are really theirs.
 Same schooling, same classical style, a shared pen name. Who wrote the "Du Ying" essays?
 Portraits: pixel art after historical photographs · dates: Lu Xun's diary; standard biographies
Figures: Timeline 1898 to 1925 with pixel portraits. Lu Xun: China (Nanjing), Japan (Tokyo, Sendai) 1902 to 1909, China (Shaoxing), China (Beijing) from 1912. Zhou Zuoren: China (Shaoxing), China (Nanjing), Japan (Tokyo) 1906 to 1911, China (Shaoxing), China (Beijing) from 1917. Together in Tokyo 1906 to 1909 and in Beijing 1917 to 1923. Events: 1909 they co-translate foreign stories; 1912 essays signed Du Ying appear in a Shaoxing paper; 1918 both write for New Youth; 1923 the brothers fall out.
Speaker notes: Does this only work in English? Let's go to China, and to a real digital humanities question. If you study the history of someone's ideas, you trace how their thinking changes from one text to the next. But first you need to know which texts are really theirs. Meet two brothers. Lu Xun, on top, is the best-known modern Chinese writer. Zhou Zuoren, his younger brother, became a major essayist and translator. Follow the two rows. They grew up in Shaoxing and studied in Nanjing. Then both went to Japan, and from 1906 to 1909 they lived together in Tokyo, reading the same books and translating foreign stories together. Then China changed fast: in 1912 the last dynasty fell and the Republic began. That January both brothers were back home in Shaoxing, and a new local newspaper printed essays signed with a pen name, Du Ying. Later both moved to Beijing. In 1918 they were writing side by side in the magazine New Youth: Lu Xun's "A Madman's Diary", widely seen as the first modern story written in everyday spoken Chinese instead of the old classical language, and Zhou's essay "Humane Literature". Within a few years schools began teaching the everyday language, which is why Chinese today is written much the way people speak. They lived together in Beijing until they fell out in 1923. So: same family, same schooling, same classical style, and a shared pen name. Who wrote the Du Ying essays?

---

## Slide 11 (duying-method)
On screen: Part 1 · Your writing has a fingerprint
 Same idea, in classical Chinese
 31 small characters, counted per 1,000 characters in essays we know each brother wrote.
 Lu Xun uses more
 之 of; it
 而 and; yet
 不 not
 于 at; in; than
 则 then
 是 this; to be
 矣 (ends a claim)
 惟 only
 夫 now, … (opens one)
 何 what; why
 Zhou uses more
 为 to be; for
 及 and; reach
 本 originally
 多 many
 皆 all
 原 at first
 但 but; only
 各 each
 自然 naturally
 别 other
 Xie, Li & Wang, "The many voices of Du Ying," Digital Scholarship in the Humanities (2025) · rates from the paper's training essays · Lab chapter 3
Figures: Bar chart of 31 small characters, sorted by how much more Lu Xun uses them than Zhou Zuoren per 1,000 characters. Red bars, Lu Xun uses more, led by 之 (Lu Xun 40.5, Zhou 27.3), 而, 不, 于, 则. Blue bars, Zhou uses more, led by 为 (Lu Xun 9.7, Zhou 15.2), 及, 本, 多, 皆.
Speaker notes: Now the same idea we used on Ted, in a different language and a different script. Instead of English words like "the" and "of", we count small characters that every classical Chinese writer has to use. Here are thirty-one of them, counted per thousand characters in essays we know each brother wrote. On the right, what the top ones mean. Red bars: Lu Xun uses them more. The biggest is 之, roughly "of": Lu Xun about forty times per thousand characters, his brother about twenty-seven. Lu Xun also loves 而, "and yet", and 矣, a particle that closes a claim with force. Blue bars: Zhou uses them more, led by 为, "to be" or "for", and softer words like 皆, "all", and 自然, "naturally". No single character decides anything. The computer weighs all thirty-one together, exactly as with Ted. So what did it say about the Du Ying essays?

---

## Slide 12 (duying-verdict)
On screen: Part 1 · Your writing has a fingerprint
 Who was "Du Ying"?
 "Looking at the Country of China" (望华国篇), signed 独应 (Du Ying), Yueduo Daily , Shaoxing, 22 January 1912
 "Looking at the Country of China"
 望华国篇
 Lu Xun · 0.98
 "People of Yue, Forget Not Your Ancestors' Instructions"
 尔越人毋忘先民之训
 Lu Xun · 0.83
 "Where Has the Character of the Republic Gone?"
 民国之征何在
 Both brothers
 Xie, Li & Wang, "The many voices of Du Ying," Digital Scholarship in the Humanities (2025) · English titles from the paper · Lab chapter 3
Figures: Newspaper scan of the essay 望华国篇 (Looking at the Country of China), signed 独应 (Du Ying), printed in vertical columns of classical Chinese
Speaker notes: Here is one of the essays as it was printed, in vertical columns, in a Shaoxing newspaper in January 1912; the signature, Du Ying, is at the top right. The computer's verdicts. "Looking at the Country of China": Lu Xun, with probability 0.98. "People of Yue, Forget Not Your Ancestors' Instructions": Lu Xun again. "Where Has the Character of the Republic Gone?": a blend of both brothers' habits, so most likely written together. So the pen name Du Ying was not one person. Sometimes it was Lu Xun, sometimes the two of them together. Different language, different script, same fingerprint. You can run this yourself in lab chapter 3.

---

## Slide 13 (four-hands)
On screen: Part 1 · Your writing has a fingerprint
 Four hands, one essay
 "The Strings of Melancholy" (哀弦篇, 1908), signed Du Ying, has long been read as Zhou Zuoren's alone.
 §1 the opening argument: Lu Xun 
 §2–4 : leaning Lu Xun 
 §6 the translated laments: Zhou 
 Zhou's draft, reworked and expanded by his older brother. 
 Already here, two paths: the fighter and the essayist.
 Not just digital humanists: computer scientists chase this too, with suspect lists that grow from two to tens of thousands, and on to internet scale.
 Xie & Wang, "Four Hands Playing in Unison: On the Authorship of 'The Strings of Melancholy'" (in preparation) · same 31 characters
Figures: Three rows on a scale from reads-like-Zhou to reads-like-Lu-Xun. Lu Xun's known essays (red dots) sit almost all on the Lu Xun side; Zhou's known essays (blue dots) almost all on the Zhou side. The six sections of The Strings of Melancholy (stars): section 1 far on the Lu Xun side; sections 2, 3 and 4 on the Lu Xun side of the middle; section 6 just on the Zhou side; section 5 hollow, no call.
Speaker notes: One more, from our newest study. This essay, "The Strings of Melancholy", was published in 1908 in Tokyo under the same pen name, Du Ying, and scholars have long treated it as Zhou Zuoren's own early work, even as the moment he arrived as a writer. We read it section by section with the same thirty-one characters. Look at the chart. Red dots: essays we know Lu Xun wrote, and the computer puts them on his side. Blue dots: essays we know Zhou wrote, on his side. The stars are the six sections of this essay; the hollow one is a section the model can't call. Section one, the big opening argument, reads like Lu Xun. Sections two to four lean toward Lu Xun. Section six, retelling the biblical Lamentations, reads like Zhou. Our reading: Zhou wrote a draft, and Lu Xun reworked and expanded it. Zhou himself later said that in those early years Lu Xun handled almost all his dealings with the outside world. The older brother was steering, and helping his younger brother make a name in letters. And you can already hear two different people. Lu Xun, forceful, arguing, the fighter. Zhou, gentler, drawn to folk songs and old texts, the essayist. After they fell out in 1923, Lu Xun kept fighting, and Zhou turned to quiet, literary essays. The seeds of that split are already in this one essay, written with four hands. And it's not only digital humanists who ask "who wrote this?". Computer scientists work on the same question, and for them the list of suspects doesn't stop at two brothers: it grows to ten thousand people, and then to the whole internet.

---

## Slide 14 (deep-learning)
On screen: Part 1 · Your writing has a fingerprint
 Your writing fingerprint can single you out from thousands
 20%
 right on the first guess, among 100,000 bloggers
 From three posts (~900 words). Guessing blindly: 0.001%.
 80%+
 right, when it answers only when confident
 Same study, stricter threshold: it names a writer about half as often.
 38%
 of internet users have writing online under their own name
 The reference an attacker needs already exists.
 VPN · HTTPS · Tor ✕ 
 hide where your words come from, not how you write them
 Style lives in small words like "the", "of" and "which". You can't write without them.
 Narayanan et al. 2012 (IEEE S&P); Pew Research Center 2013; Rao and Rohatgi 2000 (USENIX Security)
Speaker notes: Computer scientists took this question to scale. Top left: researchers collected 100,000 blogs, hid three posts from one of them, about nine hundred words, and asked the computer to find the right blog among all 100,000. It named the right one first twenty percent of the time. Guessing blindly, you would be right one time in a hundred thousand. Top right, same study: let the computer stay silent when it isn't sure. Then, when it does name someone, it is right more than eighty percent of the time; it just speaks up about half as often. Bottom left, who is exposed: a Pew survey found that 38 percent of internet users have writing online under their own name. That is exactly the reference set an attacker needs. And bottom right, the part people find surprising. A VPN, HTTPS, Tor: these hide where your words come from, your IP address, your connection. They do nothing about how you write. Your style lives in small words like "the", "of" and "which", and you cannot write a sentence without them. That brings us to the dark side of everything we have just seen.

---

## Slide 15 (part2)
On screen: Part 2
 Part 1
 Your writing has a fingerprint
 How readers, and then computers, recognize a writer
 · Two translators of Confucius
 · The Unabomber
 · The Lu Xun brothers
 · At scale: thousands of writers
 Part 2
 When the fingerprint becomes a threat
 Can you hide? And what changes when anyone can ask an AI?
 · Who needs to stay anonymous
 · Machine Zone vs. John Doe
 · Hiding by hand, with software
 · … and with LLMs
 Then: a hands-on lab you can run in your browser.
Speaker notes: That was part one: your writing gives you away, in any language, even among thousands of people. Now let's flip sides. When that fingerprint becomes a threat, can you hide? We will meet the people who need to stay anonymous, a real lawsuit, and three ways to disguise your writing: by hand, with software, and by simply asking a language model.

---

## Slide 16 (why-anon)
On screen: Part 2 · When the fingerprint becomes a threat
 Who needs to stay anonymous?
 Journalism
 A reporter's source
 tells the press what their company hides
 Whistleblowing
 An insider
 reports fraud at their own agency
 Activism
 A critic
 writes about a government that jails critics
 Work
 An employee
 reviews their boss online
 Machine Zone
vs. John Doe
 1
 Anonymous Glassdoor review: "A Scandal" ★☆☆☆☆
 2
 The game company sues "John Doe"
 3
 A judge orders Glassdoor to reveal the name
 4
 2017, on appeal: Doe stays anonymous 
 Glassdoor, Inc. v. Superior Court (2017) 9 Cal.App.5th 623 · icons: Cookie Art Studio (licensed)
Figures: Line-art icon of a young man in a cap: John Doe
Speaker notes: Why would anyone need to hide? Think of who writes without a name. A reporter's source, telling the press what their company is hiding. A whistleblower reporting fraud at their own agency. An activist writing about a government that jails its critics. Or simply an employee reviewing their boss online. Here is a real case of that last one. Machine Zone is a California company that made a hugely popular mobile game, Game of War. One day an anonymous review appeared on Glassdoor, the site where employees rate their employers. Its title: "A Scandal". One star. It went after the company's financing announcement, complained that some teams were overworked, and attacked management's decisions. The court later described the writer as a former employee. Machine Zone sued the anonymous writer, whom the court papers call John Doe, saying the review broke a nondisclosure agreement. To sue someone you need a name, so the company asked Glassdoor to reveal who Doe was, and a trial judge ordered Glassdoor to hand it over. Glassdoor fought back. In 2017, the California Court of Appeal ruled for Glassdoor: the site could stand up for its anonymous users, and Machine Zone had never shown that the review revealed anything confidential. Doe stayed anonymous, thanks to a website willing to go to court.

---

## Slide 17 (threat)
On screen: A hypothetical; the court record reports no stylometry · review paraphrased · map and odds are illustrations, not measurements · icons: Cookie Art Studio (licensed)
 Part 2 · When the fingerprint becomes a threat
 What if Machine Zone didn't need Glassdoor?
 John Doe's review
 "Scandal! Management touts a 'translator' that simply calls the Google API and brags about raising $250 million… no proof ever surfaced. Terrible work-life balance…"
 💡 Rewritten, same message
 "loser company. execs hype a translation software that just pings Google and flaunt an unverified $250 M JP Morgan deal… future looks bleak…"
 The model's odds
 The company's model
Figures: Icon: John Doe | Bar chart, without rewrite: Alice 14%, Bob 72%, Charlie 14%. | Icon: a hooded adversary at a laptop | Schematic map split into three regions, Alice, Bob and Charlie, each with their icon and dots for their known writing. A red star, the review, falls in Bob's region. | Bar chart, with a back-translated rewrite: Alice 35%, Bob 29%, Charlie 36%; Bob is now the lowest. | A hollow star, the rewritten review, moves up to where the three regions meet, just on Charlie's side.
Speaker notes: Now the uncomfortable question. What if Machine Zone had not needed Glassdoor at all? This part is hypothetical; nothing in the court record says the company tried it. Here is John Doe's review, paraphrased: the company brags about a translator that just calls Google, about a big investment nobody can prove, and the work-life balance is terrible. The company has a list of suspects, people who recently left: say Alice, Bob and Charlie. And it has their known writing: years of emails and memos on its own servers. That is the same setup we used on Ted Kaczynski and the Lu Xun brothers. The company trains a model on those emails, and the model splits the space into Alice's style, Bob's style and Charlie's style. Then it drops the review in. The star lands in Bob's region, and the model gives Bob about seventy percent. And look at Bob's face: it's John Doe. No court, no subpoena, no Glassdoor. Just the words. [click: the rewrite appears, then the odds change, then the star moves] Now suppose Doe had rewritten the review first, for example by running it through a translator into German and back, keeping the message but changing the habits. The star slides up to where the three styles meet, and the odds flatten out: about a third each, with Bob now the least likely. The model is no longer sure. That is the idea behind every disguise we will see next.

---

## Slide 18 (three-ways)
On screen: Part 2 · When the fingerprint becomes a threat
 Three ways to hide your hand
 By hand
 You rewrite it yourself
 With software
 A program tells you what to change, or changes it for you
 With LLMs
 You just ask
Speaker notes: So if you were John Doe, how could you hide? People have tried three ways. First, by hand: you rewrite the text yourself. Second, with software: a program points out your habits and suggests changes, or rewrites the text for you. And third, the newest: you simply ask a large language model. For each one, keep two questions in mind. Does the message survive? And is the writer really hidden, not just from one detector, but from anyone who might look?

---

## Slide 19 (adversarial)
On screen: Brennan, Afroz and Greenstadt 2012; replication with new writers: Wang, Juola and Riddell 2026 · SVM attacker, 10 candidates · error bars: 95% CI over 1,000 random candidate draws
 Part 2 · When the fingerprint becomes a threat
 By hand: it works
 Volunteers wrote a short essay as usual, or were told to:
 "write differently" 
 write like novelist Cormac McCarthy 
 Either way, the computer's hits fell from 37% to 14–22%. 
 But you have to know what to change, and you have to do it every time you write.
Figures: Bar chart, 10 candidate writers: identified correctly 36.6% as written (95% CI 35.9–37.3), 14.0% when told to write differently (13.4–14.6), 21.5% when imitating Cormac McCarthy (20.8–22.2); pure guessing is 10%.
Speaker notes: The oldest way to hide is to do it yourself. In a classic study from 2012, volunteers wrote short essays three ways: as they normally would; after being told simply to "write differently", to disguise their style; or after being told to write like the novelist Cormac McCarthy. Allen, Patrick Juola and I repeated that study with a new group of writers, and this chart is from our version. A computer tries to pick the writer out of ten candidates. Writing as usual, it gets it right 36.6 percent of the time; guessing would give you 10. Told to write differently, it drops to 14. Imitating McCarthy, 21.5. The little bars are 95 percent confidence intervals: we drew the ten candidates at random a thousand times, so these numbers are very stable. So hiding by hand works. But notice what it asks of you. You have to know what to change, and you have to do it every single time you write. That is where software comes in.

---

## Slide 20 (helper-tool)
On screen: Part 2 · When the fingerprint becomes a threat
 With software: Google Translate, and back
 It helps: the computer's hits fall from 37% to 24–29%.
 But your draft leaves your computer. The translator runs on someone else's server.
 Tools built for hiding are hard to use: 
 · tips like "use fewer instances of the letter i"
 · volunteer projects that break as platforms change
 Wang, Juola and Riddell 2026: same writers as the previous slide, round trips by Google Translate · SVM attacker, 10 candidates · 95% CI over 1,000 random candidate draws · McDonald et al. 2012 (Anonymouth)
Figures: Bar chart, 10 candidate writers: identified correctly 36.6% as written; after a Google Translate round trip via German 26.5%, via Japanese 23.6%, via German then Japanese 28.9%; pure guessing is 10%. Error bars are 95% confidence intervals.
Speaker notes: Remember Bob, our John Doe? This is exactly what he could try: paste the review into Google Translate, turn it into German, and translate it back into English. Free, fast, no skill needed. Does it work? In our study with the same writers as the last slide, we did exactly that, through German, through Japanese, and through both. Writing as usual, the computer finds the writer 37 percent of the time. After a round trip, 24 to 29 percent. So it helps, quite a bit, for almost no effort. But there is a catch. Google Translate does not run on your laptop. Your draft, the very text you are trying to protect, travels to someone else's server. For most people that is fine; for someone who is truly at risk, that alone can be a problem. There is also software built specifically for hiding your style. It reads your draft and gives you advice. The trouble is the advice: a real tool told its users to "use fewer instances of the letter i". Without training in linguistics, that is very hard to act on. And these tools are mostly research projects kept alive by volunteers. Browsers, operating systems and platforms keep changing, and keeping a tool working everywhere is a job nobody is paid to do. So many of them simply stop working.

---

## Slide 21 (llms)
On screen: Part 2 · When the fingerprint becomes a threat
 LLMs: just ask
 One sentence to a free, open model you run yourself: "rewrite this so no one can tell it's me."
 18 models we tested
 Llama 3, 3.1 (8B)
 Qwen 2.5–3.8 (7–35B)
 Gemma 2–4 (4–31B)
 Ministral 8B, Mistral Small 24B
 gpt-oss 20B
 Every one made the writer harder to find. A local LLM is good enough, and your draft never leaves your machine. 
 18 open-weight model configurations × 4 requests × 66 texts = 4,752 rewrites · hidden = 1 − attribution accuracy, averaged over 3 attackers (Writeprints SVM, Koppel-512 logistic regression, RoBERTa) · meaning kept = SMART-1 F1 with Mutual Implication Score sentence matching · our benchmark
Figures: Chart: how well the writer is hidden versus how much meaning is kept. The original text keeps all meaning but is poorly hidden. Translating to Chinese and back keeps the most meaning and hides the least; write differently and simple English are in the middle; imitating McCarthy hides the most but keeps the least meaning. | mistral logo
Speaker notes: Now the newest way to hide: just ask a language model. One sentence, typed into a free, open model that you run yourself, so your draft never leaves your machine. We tried eighteen of them, from Meta, Alibaba's Qwen, Google's Gemma, Mistral and OpenAI's open model, with four kinds of request: write differently, imitate Cormac McCarthy, use simple English, or translate to Chinese and back. Almost five thousand rewrites. Read the chart this way: further right means better hidden; higher means more of your original meaning survives. To measure meaning, we match each sentence of the rewrite to the original and score whether one implies the other. The black star is your original text: all of the meaning, easy to find. Translating to Chinese and back keeps the most meaning; imitating McCarthy hides you the most. Every one of the eighteen models made the writer harder to find. So a local model is good enough to give real protection, and nothing has to leave your computer. So, what would this have meant for John Doe?

---

## Slide 22 (takeaways)
On screen: Close
 Wrapping up
 Your words carry a fingerprint, in any language, mostly in the small words.
 At scale it can single you out from thousands, and a VPN won't hide it.
 Hiding works by hand, with software, and most easily with a local LLM.
 Authorship identification
 From the text, find the writer.
 Defense against authorship identification
 Keep your style from giving you away.
 Stylometry
 the quantitative study of writing style
 Closing line: Haining Wang, Defending Against Authorship Identification Attacks (Springer Nature, forthcoming)
Speaker notes: Let me pull today together. On the left, the first half: your words carry a fingerprint, in any language, mostly in the small words you never think about, "because", "and", "the", 之 and 而. And at scale, that fingerprint can pick you out of thousands of people; a VPN or an encrypted connection does nothing about it, because it lives in how you write, not where you write from. [click] That side of the field is called authorship identification: from the text, find the writer. On the right, the second half: you can hide, by hand, with software, and today most easily with a language model running on your own machine. [click] That side is called defense against authorship identification. [click] Together, the two sides make one field: stylometry, the quantitative study of writing style. As I put it at the end of my book, I hope this work helps more people say what needs to be said, without making their identity the price of being heard.

---

## Slide 23 (field-map)
On screen: Close · The field
 Where stylometry meets other fields
 Statistics and machine learning
 The "computer" in this talk, from counting words to deep neural networks.
 Literature and digital humanities
 Who wrote which text, and how a writer's thinking grew: the Lu Xun brothers.
 Forensic linguistics and cybersecurity
 The Unabomber; an anonymous review and a lawsuit.
 Behavioral science and computational social science
 Style shifts with topic, time, register, genre, even where you type.
Figures: A small Galton board: balls fall through rows of pegs and pile up into a bell curve. | A handscroll on a table: two brushes take turns writing columns of running script, one in blue and one in orange, then a seal is stamped at the lower left. | A typewriter types two lines; one letter always lands slightly high, in orange: the machine's tell. | A starling murmuration: a dense flock that stretches, twists, folds and rolls over as one body.
Speaker notes: Stylometry also sits at a crossroads with other fields. Top left, statistics and machine learning: the "computer" I kept mentioning, from simple word counts all the way to deep neural networks; think of the Galton board, where small random pushes add up to a predictable shape. Top right, for many of you, literature and the digital humanities: two brushes, one scroll, one seal; who wrote which text, and then, once we know, how a writer's thinking grew over a lifetime, like the Lu Xun brothers. Bottom left, forensic linguistics and cybersecurity: the typewriter is the classic anonymous-letter machine, and even it has a tell, a letter that always lands a little high; real cases like the Unabomber and the anonymous review. And bottom right, behavioral science and computational social science. Think of a starling murmuration: every bird follows a few simple habits, watching its neighbours, and the flock makes shapes no single bird plans. Style is behavior in the same way, individual and social at once: it shifts with topic, with time, with register and genre, even with whether you type in a browser or a word processor.

---

## Slide 24 (field-history)
On screen: Close · The field
 Nearly two centuries of telling writers apart
 still rising 1851
 De Morgan asks: could word length tell who wrote parts of a sacred text?
 1887
 Mendenhall draws word-length curves for Dickens and Thackeray.
 1944
 Yule measures vocabulary to settle a disputed book of devotion.
 1963
 Mosteller and Wallace count small words and settle the Federalist Papers.
 1990s
 English courts admit a counting method; it fails on live TV.
 Today
 Digital humanities, deep learning, LLMs.
 De Morgan 1851 (letter); Mendenhall 1887 (Science); Yule 1944; Mosteller and Wallace 1963 (JASA); Juola 2008, Authorship Attribution, §2.3.3 (cusum in English courts)
Speaker notes: People have been asking this for a long time. In 1851, the mathematician Augustus De Morgan wrote to a clergyman who was puzzling over who wrote parts of a sacred text nearly two thousand years old. Maybe, he suggested, you could count: does one text use longer words than the other? In 1887 Thomas Mendenhall actually drew word-length curves for Dickens and Thackeray. In 1944 the statistician Udny Yule measured vocabulary to settle who wrote a famous medieval book of devotion. In 1963 Frederick Mosteller and David Wallace counted small words like "upon" and "whilst" and settled who wrote the disputed Federalist Papers, the same idea you saw with Ted. The field has had its stumbles, too. In the early 1990s, English courts admitted a counting method called cusum as evidence. Then its champion was tested on live British television and could not tell a convicted criminal's writing from that of the Chief Justice of England. As Patrick Juola puts it, that failure cast a long shadow over the whole field, and it took careful testing and error rates to earn back trust. Today stylometry is one of the core methods of digital humanities, and with deep learning and large language models it is far stronger than anything Mosteller and Wallace could do, and still rising, in both directions: finding writers, and protecting them. [At IU:] I want to end with a personal note. Seven years ago, almost exactly this time of year, I was a brand-new PhD student here, walking down the stairs with Allen. I came from a library background and had never done machine learning. I told him I wanted to work on stylometry. Looking back, it may be the most important decision I have made since turning thirty. It opened a new world for me. Thank you, Allen.

---

## Slide 25 (lab)
On screen: Close
 Lab: be the detective
 1 · The Analects 
 Two translations: read like a human, then count like a machine
 2 · The Unabomber
 Rerun our statistical test
 3 · The Lu Xun brothers
 Settle a dispute in classical Chinese
 4 · Protect John Doe
 Disguise his review so the computer can no longer find him
 hainingwang.org/teaching/stylometry
 Self-paced case study with Python · runs in your browser · no sign-up
 Assisted by B'lawd 
 Lab: hainingwang.org/teaching/stylometry · code MIT-licensed · data licenses listed in the lab
Figures: QR code linking to hainingwang.org/teaching/stylometry | B'lawd, a pixel tabby cat who helps in the lab
Speaker notes: Then questions. Now it's your turn. Scan the code or type the address: hainingwang.org/teaching/stylometry. It is a self-paced case study in Python that runs entirely in your web browser: nothing to install, no account to create. You go step by step, print what goes in and what comes out, and by the end you will have finished your first machine-learning project. If you get stuck, ask B'lawd, the lab's cat assistant; it knows today's lecture and the lab. There are four short chapters, one for each case today. In the first, you'll read two translations like a human and then count words like a machine. In the second, you'll rerun our Unabomber analysis yourself. In the third, you'll settle the Lu Xun question in classical Chinese. And in the fourth, you switch sides and protect John Doe: disguise his review, by hand or with an AI, so the computer can no longer find him, while it still says what he meant. If you're watching in class, open the link now so it loads while we take questions. Thank you.

---

# The lab (hainingwang.org/teaching/stylometry): four cases, each a series of steps with Python code that runs in the browser

---

## Case 1 · Two translations of Confucius's *Analects* (open with #ch1)
Two professors translated the same Chinese book, Confucius's *Analects*. **Lionel Giles** was British and published his version in 1907.
**Robert Eno** is American, teaches at Indiana University, and published his in 2015. Same sayings, same meaning, two different hands.

The oldest way to name an author is to **read and notice**: a spelling, a favourite phrase, a rhythm.
We start there, then let a computer count what a reader cannot see.
### Step 0 · Open the box
Everything runs **inside your browser**: no account, no installation, no server doing the maths.
Click the round **▶** on the left of a code box to run it. Run the boxes from top to bottom; each one builds on the one before.

The first box loads two things. One is both translations, already cut into pieces called **chunks** (about 300 words each). The other is a list of 224 small English words such as *the*, *and*, *of*, *which*. Those are **function words**: they carry grammar, not topic.

**What you'll see:** the number of chunks, the number of function words, and the first twelve words of the list.
```python
# Load the lab's data (the files sit next to this web page).
import json
import numpy as np                  # numbers and tables of numbers
import lab_helpers as H             # small helper functions written for this lab
import lab_ch1 as G                 # this case's plots

chunks = H.load_json("data/ch1/chunks.json")["chunks"]       # one record per ~300-word chunk
fw = H.load_fw224()                                           # the 224 function words
passages = {p["id"]: p for p in H.load_json("data/ch1/step1_passages.json")}   # a few short passages to read

print(len(chunks), "chunks,", len(fw), "function words")
fw[:12]
```
### Step 1 · Read the same saying twice
Here is one saying of Confucius (*Analects* 17.8) in both translations, six lines each, side by side. The meaning is the same. The wording is not.

Read down the two columns. Which phrases does each translator come back to again and again?
```python
# Cut each passage into sentences, then put sentence k of Giles next to sentence k of Eno.
giles = passages["giles_shadows"]["text"]
eno = passages["eno_shadows"]["text"]
g, e = G.sentences(giles), G.sentences(eno)

rows = [[k + 1, a, b] for k, (a, b) in enumerate(zip(g[4:], e[1:]))]
H.show_table(["#", "Giles (1907)", "Eno (2015)"], rows, "Analects 17.8: six pairs, two hands")
```
### Step 2 · Read, then guess
Below is a short **mystery note X**. One of our two professors wrote it. **Before you scroll on:** who was it, Giles or Eno?

Type your guess in the last line, then write down *what in the text* made you choose it. A guess with a reason is the start of every authorship study.

**Try it:** change `"?"` to `"Giles"` or `"Eno"`.
```python
# Print the mystery note X (the author is hidden).
print(passages["X"]["text"])

my_guess = "?"        # change me to "Giles" or "Eno"
```
### Step 3 · The clue that needs no statistics
A careful reader finds one clue fast: **spelling**. British writers write *candour*, *valour*, *travelling*; Americans write *candor*, *valor*, *traveling*.
The code checks which spellings appear in each passage.

Was your guess right? This works here, but only until someone writes a note in the other spelling. Next we look for habits a writer cannot see in themselves.
```python
# British or American spelling? Look at the words of each passage.
british = {"candour", "valour", "travelling", "colour", "honour"}
american = {"candor", "valor", "traveling", "color", "honor"}
for pid in ["giles_shadows", "eno_shadows", "X"]:
    words = set(H.tokens(passages[pid]["text"]))
    print(pid.ljust(14), "| British:", sorted(words & british), "| American:", sorted(words & american))

print("\nYour guess was:", my_guess)
print("The answer: X is by Giles. It is his own footnote, and he wrote 'Travelling'.")
```
### Step 4 · Cut the books into chunks
A computer cannot read a whole book and say "this feels like Giles". So we cut each translation into **chunks** of about 300 words and treat each chunk as one small example.
Giles gives 50 chunks, Eno gives 77: 127 chunks in all, and we know who wrote every one. That known author is called the **label**.

Each block in the picture is one chunk, as wide as the chunk is long.

**What you'll see:** two rows of blocks, blue for Giles, orange for Eno.
```python
n_words = np.array([c["n_words"] for c in chunks])      # how many words in each chunk
author = np.array([c["author"] for c in chunks])        # the label of each chunk: "Giles" or "Eno"
counts = np.array([c["fw"] for c in chunks])            # 127 rows (chunks) x 224 columns (function words)

print("first five chunks:", [c["id"] for c in chunks[:5]], "by", author[:5].tolist())
H.show_plot(G.chunk_map(author, n_words))
```
### Step 5 · Meet the function words
Words come in two kinds. **Topic words** (*government*, *virtue*, *grave*) tell you what a text is about. **Function words** (*the*, *and*, *of*, *which*, *you*, *not*) hold the sentence together. We use them without thinking, so each writer's habits leak out through them.

Below, the first 50 words of one Giles chunk, with every function word in CAPITALS. For Eno we keep only the counts, which is all the computer needs.

**What you'll see:** a paragraph with about half its words shouting, and one line with the share.
```python
sample = chunks[0]["text"]                       # chunk G01, by Giles
print(G.shout_function_words(sample, fw))        # function words in CAPITALS

share = counts.sum(axis=1) / n_words             # per chunk: function words / all words
f"On average {share.mean():.0%} of a chunk's words are function words"
```
### Step 6 · Count them
Counting is all stylometry does at first. For every chunk and every function word we count how many times the word appears. One chunk becomes **a row of 224 numbers**.

The table shows eight words for the first four chunks of each translator. Compare the rows: do the numbers look alike inside a translator?

**Try it:** change the words in `show` to others from the list.
```python
print("counts has", counts.shape[0], "rows (chunks) and", counts.shape[1], "columns (function words)")

show = ["the", "and", "of", "to", "which", "you", "if", "not"]    # change me!
cols = [fw.index(w) for w in show]                                # where each word sits in the list
pick = list(np.where(author == "Giles")[0][:4]) + list(np.where(author == "Eno")[0][:4])
rows = [[chunks[k]["id"], author[k], n_words[k]] + list(counts[k, cols]) for k in pick]
H.show_table(["chunk", "author", "words"] + show, rows, "Raw counts: first 4 chunks of each translator")
```
### Step 7 · The most used words in each translation
Add up the counts over a whole translation and you get its favourite words. The bars show how many of every 100 words each function word takes.

**What you'll see:** the same small words lead in both translations (that is simply English), but the order and the heights differ. Giles puts *of* second and uses *he* and *his* a lot; Eno puts *to* second and keeps *not* in his top eight.
```python
H.show_plot(G.top_words(fw, counts, n_words, author, k=12))
```
### Step 8 · Same words, side by side
Chunks are not all the same length, so we compare **per 1,000 words**. Each row is one word. The blue dot is how often Giles uses it in an average chunk, the orange dot how often Eno does, and the thin bars show where the middle half of each translator's chunks lie.

**What you'll see:** some words sit almost on top of each other (*you*, *and*), others pull apart: Giles leans on *of* and *which*, Eno on *not*, *if* and *the*. No word separates them cleanly, because the bars overlap. Each one only tilts the odds.

**Try it:** put other words from the list into `WORDS`, such as `"shall"`, `"he"`, `"is"`.
```python
per1000 = counts / n_words[:, None] * 1000        # each count as "times per 1,000 words"

WORDS = ["the", "and", "of", "to", "which", "you", "if", "not"]    # change me!
H.show_plot(G.rate_dots(fw, per1000, author, WORDS))
```
### Step 9 · One dot per chunk
Now every chunk becomes a single dot, placed by **two** numbers: how often it uses *and* (across) and *the* (up). Each such number is a **feature**. The large squares mark each translator's average. The green star is the mystery note X.

**What you'll see:** the two clouds overlap a lot. Two words give a hint, not an answer. Try to picture one straight line that splits blue from orange.

**Try it:** replace `"and"` and `"the"` with `"which"` and `"you"`.
```python
w1, w2 = "and", "the"                      # change me!
i, j = fw.index(w1), fw.index(w2)

# Count the function words of the mystery note X in exactly the same way as the chunks
x_text = passages["X"]["text"]
x_counts = np.array(H.fw_counts(x_text, fw))
x_per1000 = x_counts / len(H.fw_tokens(x_text)) * 1000

H.show_plot(G.scatter_two(per1000, author, i, j, w1, w2, x_point=(x_per1000[i], x_per1000[j])))
```
### Step 10 · Build the table X and the answers y
Machine learning needs two things. First a table of numbers, called **X**: one row per example, one column per **feature** (here, a function word). Second the right answers, called **y**, one per row: the **label**. We write 1 for Giles and 0 for Eno.

**What you'll see:** the shape of X (rows, columns) and a stretch of y where the 1s turn into 0s, where the Giles chunks end and Eno's begin.
```python
X = counts                                   # the table of features: 127 chunks x 224 words
y = (author == "Giles").astype(int)          # the answers: 1 = Giles, 0 = Eno

print("X has", X.shape[0], "rows and", X.shape[1], "columns")
print("Giles chunks:", y.sum(), "| Eno chunks:", (y == 0).sum())
y[45:55]                                     # five last Giles answers, then five first Eno answers
```
### Step 11 · Turn counts into shares
A longer chunk has bigger counts for every word, which is not a habit, only length. So we divide each row by its total: every row becomes **shares** that add up to 1. In scikit-learn this step is called a *Normalizer*.

**What you'll see:** the same chunk as counts and then as shares, and the total of a row of shares.
```python
from sklearn.preprocessing import Normalizer

shares = Normalizer(norm="l1").fit_transform(X)       # each row now adds up to 1

show = ["the", "of", "and", "which", "you", "not"]
cols = [fw.index(w) for w in show]
print("words:             ", show)
print("chunk 1, counts:   ", X[0, cols])
print("chunk 1, shares:   ", shares[0, cols].round(3))
print("a row of shares adds up to", round(shares[0].sum(), 3))
```
### Step 12 · Put every word on the same scale
*The* is huge and *which* is tiny. Left alone, the big words would drown the small ones. So we rescale each column: **0 means "as usual", +1 means "a bit more than usual", -1 "a bit less"**. This is a *StandardScaler*.

**What you'll see:** for two words, the average and spread before and after, then the first chunk in the new units.
```python
from sklearn.preprocessing import StandardScaler

scaled = StandardScaler().fit_transform(shares)       # every column: average 0, spread 1

for w in ["the", "which"]:
    k = fw.index(w)
    print(f'"{w}":  before  average {shares[:, k].mean():.4f}, spread {shares[:, k].std():.4f}'
          f'   |   after  average {scaled[:, k].mean():.1f}, spread {scaled[:, k].std():.1f}')
print()
print("chunk 1 after rescaling:", {w: round(float(v), 2) for w, v in zip(show, scaled[0, cols])})
```
### Step 13 · Train the model
Now the computer learns. **Logistic regression** gives each of the 224 words a **weight**, then adds up weight × value over all words to make a score for a chunk. Training means searching for the weights that make the score right for as many labelled chunks as possible.

The three steps (shares, rescale, logistic regression) go into one **pipeline**, so that new texts get the same treatment.

**What you'll see:** the pipeline, and its answers for ten chunks it has just studied.
```python
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline

model = make_pipeline(Normalizer(norm="l1"), StandardScaler(), LogisticRegression(C=1, solver="lbfgs", max_iter=10000))
model.fit(X, y)                                       # learning happens here

print(model)
print("truth:    ", y[45:55])
print("its guess:", model.predict(X[45:55]))
```
### Step 14 · Look inside: which words matter?
Training left behind 224 weights, one per word. A **positive weight** pushes a chunk towards Giles, a **negative weight** towards Eno. The bigger the weight, the stronger the push.

No single word decides. The model adds all 224 pushes together.

**What you'll see:** the ten strongest words on each side. *Which* and *of* push hardest towards Giles; *not*, *someone* and *does* push hardest towards Eno.
```python
coef = model[-1].coef_[0]                 # the 224 weights (the last step of the pipeline)
order = np.argsort(coef)                  # most "Eno" first ... most "Giles" last

print("strongest for Eno:  ", [fw[k] for k in order[:5]])
print("strongest for Giles:", [fw[k] for k in order[::-1][:5]])
H.show_plot(G.weights_bars(fw, coef, k=10))
```
### Step 15 · Hold some chunks back
The ten guesses above were on chunks the model **studied**. That is like a student who gets the exam questions in advance. To measure real skill we must test on chunks the model has **never seen**: held-out chunks.

So we split the 127 chunks into 5 piles. In round 1 the model trains on 4 piles and is tested on the fifth.

**What you'll see:** a near-perfect score on chunks it studied and a lower, honest score on the hidden ones. The honest one is what counts.
```python
from sklearn.base import clone
from sklearn.model_selection import StratifiedKFold

splits = list(StratifiedKFold(n_splits=5).split(X, y))   # 5 piles of chunks
train_idx, test_idx = splits[0]                            # round 1: pile 1 is hidden

round1 = clone(model).fit(X[train_idx], y[train_idx])      # a fresh model that never sees pile 1
print("trained on", len(train_idx), "chunks, hidden", len(test_idx), "chunks")
print(f"right on the chunks it studied:     {round1.score(X[train_idx], y[train_idx]):.0%}")
print(f"right on the hidden chunks (round 1): {round1.score(X[test_idx], y[test_idx]):.0%}")
```
### Step 16 · Five rounds, one honest score
Do the same with each pile in turn. After 5 rounds **every chunk has been hidden once**, and we have one guess for each, made by a model that never saw it. This is **cross-validation**.

**Accuracy** is the share of guesses that are right. To read it you need two yardsticks: a **coin flip** gets 50%, and **always answering "Eno"** gets 61%, because 77 of the 127 chunks are Eno's.

**What you'll see:** the score of each round and the final accuracy.
```python
from sklearn.model_selection import cross_val_predict, cross_val_score

rounds = cross_val_score(model, X, y, cv=5)                                   # accuracy of each round
p_held = cross_val_predict(model, X, y, cv=5, method="predict_proba")[:, 1]   # P(Giles) for every chunk, from the round that hid it
guess = (p_held > 0.5).astype(int)                                            # more than 50% Giles -> say Giles

print("accuracy in each round:", (rounds * 100).round().astype(int), "%")
print(f"{(guess == y).sum()} of {len(y)} hidden chunks guessed right")
f"Held-out accuracy with all {len(fw)} words: {(guess == y).mean():.0%}   (coin flip 50%, always 'Eno' {np.mean(y == 0):.0%})"
```
### Step 17 · Right and wrong, in four boxes
A guess can go four ways. The model says Giles and it is Giles (right), says Eno and it is Eno (right), says Giles but it is Eno (wrong), or says Eno but it is Giles (wrong). Counting the four gives a **confusion matrix**.

**What you'll see:** the green tiles on the diagonal are the right guesses, the grey tiles are the mistakes.
```python
H.show_plot(G.confusion_plot(y, guess))
```
### Step 18 · How sure was each guess?
The model does not only say a name. It gives a **probability**: "I am 90% sure this is Giles". Above 50% it says Giles, below 50% it says Eno; that cut-off is the **threshold**, the dashed line.

Each dot is one hidden chunk, in the row of its true author. Ringed dots are mistakes.

**What you'll see:** blue dots gather on the right, orange dots on the left. The ringed dots are the mistakes: they landed on the wrong side of the line.
```python
wrong = np.where(guess != y)[0]                          # the chunks it got wrong
worst = wrong[np.argsort(-np.abs(p_held[wrong] - 0.5))][:4]   # the four it was most sure about
for k in worst:
    print(f'{chunks[k]["id"]}: really {author[k]}, but the model gave P(Giles) = {p_held[k]:.2f}')

H.show_plot(G.prob_strip(p_held, y))
```
### Step 19 · Now try with just two words
Back to *and* and *the*. Give the same kind of model only these two features and test it the same way: 5 rounds, hidden chunks.

**What you'll see:** a score *below* "always answer Eno". Two words are not enough; the extra 222 are what makes the model work.

**Try it:** change `"and"` and `"the"` to two other words.
```python
from sklearn.model_selection import cross_val_score

two = [fw.index("and"), fw.index("the")]               # change me!
shares = X / X.sum(axis=1, keepdims=True)              # the same shares as before, from all 224 words
two_model = make_pipeline(StandardScaler(), LogisticRegression(C=1, max_iter=10000))

acc2 = cross_val_score(two_model, shares[:, two], y, cv=5).mean()
print(f"Only 'and' + 'the':   {acc2:.0%} right on hidden chunks")
print(f"Always answer 'Eno':  {np.mean(y == 0):.0%}")
print(f"All {len(fw)} words:        {(guess == y).mean():.0%}")
```
### Step 20 · Add words one by one
What happens in between? We start with *the* and *and*, then let the model look at more and more function words (the most used first), and measure the accuracy on hidden chunks each time.

**What you'll see:** a line that climbs as words are added, from 58% with two words to 82% with all 224. The purple dot is the 2-word model, the blue dot is the full model.
```python
order = G.word_order(X, fw)                  # "the", "and", then the rest, most used first
sizes = [2, 10, 50, 100, 224]                # how many words the model may look at

accs = []
for n in sizes:
    accs.append(G.cv_accuracy(X, y, order[:n]))
    print(f"{n:>3} words: {accs[-1]:.0%}")

H.show_plot(G.accuracy_curve(sizes, accs, np.mean(y == 0)))
```
### Step 21 · Back to the mystery note X
Finally the question we began with. The note X is not among the 127 chunks, so the model has never seen it. We count its function words, feed the 224 numbers to the trained model, and read off the probability.

**What you'll see:** the strip from Step 18 with the green star for X.
```python
p_x = model.predict_proba([x_counts])[0, 1]           # x_counts: the 224 counts of X from Step 9
print(f"Mystery note X:  P(Giles) = {p_x:.2f}    P(Eno) = {1 - p_x:.2f}")
print("The model says:", "Giles" if p_x > 0.5 else "Eno")

H.show_plot(G.prob_strip(p_held, y, x_p=p_x))
```
### You just finished a machine-learning project
- **Data:** you cut two books into 127 chunks and counted 224 small words in each.
- **Features and labels:** the counts are the features (table **X**), the translator is the label (answers **y**).
- **Training:** logistic regression learned one weight per word.
- **Testing:** you hid chunks, scored the model on what it never saw, and read the result against a coin flip and "always Eno".
- **Decision:** 224 words reach 82%, *and* + *the* alone 58%, and the mystery note X goes to Giles.

Stuck on a step, or curious why? Ask **B'lawd**, bottom right.
Credits: Texts: Lionel Giles, *The Sayings of Confucius* (1907; Project Gutenberg #46389, public domain). Robert Eno, *The Analects of Confucius: An Online Teaching Translation* (v2.21, 2015): only derived counts are used here, plus one short excerpt quoted for teaching. Function-word list: derived for this lab (the 224-word list FW in unabom/scripts/verify.py). See the data notes.

---

## Case 2 · The Unabomber (open with #ch2)
**The story.** From 1978 to 1995, someone the FBI called the "Unabomber" sent 16 bombs, killing 3 people and injuring 23.
In 1995 he promised to stop if his 35,000-word essay, *Industrial Society and Its Future* (the manifesto), was published; the Washington Post printed it on September 19, 1995.
Linda Patrik and her husband David Kaczynski read it and feared it was David's brother, Ted. From February 1996 they worked with the FBI through a lawyer, handing over Ted's letters and a 1971 essay.
FBI agents compared the documents **by hand**. Ted Kaczynski was arrested at his Montana cabin on April 3, 1996, and pleaded guilty in 1998.
(Sources: the April 3, 1996 search-warrant affidavit; contemporaneous news reports.)

**Our question:** can a computer learn Ted's small-word habits from his 1971 essay, and does the manifesto show them?
We show the computer Ted's 1971 essay labelled "Ted", and 19 other anti-technology writers (Mumford, Ellul, Illich, Postman, Zerzan and others) labelled "not Ted". Then we let it score texts it has never seen.
It only counts **224 small words** (*the, of, which, nevertheless, ...*), in pieces of 1,000 words. No text is shipped, only counts.
### Step 0 · Open the box
Welcome to your first machine-learning project. Click the round **▶** next to a code box to run it, and go from top to bottom. Every box shows what it did.

Like in Google Colab, the **last line** of a box shows its value: write a name such as `fw[:10]` on the last line and you see it, no `print` needed.

Our data are **counts only**: for every 1,000-word piece of text, how many times each of **224 small words** appears. No sentences are shipped.

**What you'll see:** what is in the box, then the first ten small words.
```python
import json
import numpy as np
import lab_helpers as H                   # small display helpers written for this lab
import lab_ch2 as G                       # the Unabomber data and pictures

D = G.load()                              # all the counts
fw = D["fw"]                              # the 224 small words, in a fixed order

print(f"Ted's 1971 essay:    {len(D['t2']['n'])} pieces of 1,000 words")
print(f"other writers:       {len(D['impostors'])} texts by {len({r['author'] for r in D['impostors']})} anti-technology writers")
print(f"Ted's later essays:  {len(D['ted_post'])} texts, written 1999-2016")
print(f"the manifesto:       {len(D['u14']['n'])} pieces")
fw[:10]                                   # the last line shows its value
```
### Step 1 · Read two short samples
Ted's 1971 essay and the 1995 manifesto argue the same kind of thing. But many writers attacked technology in those years, so "it sounds like him" proves little.

The computer will ignore the topic and look at something writers hardly notice: their **small words**.

**What you'll see:** the opening line of each text.
```python
for e in json.load(open("data/ch2/excerpts.json")):
    print(e["source"])
    print('   "' + e["text"] + '"\n')
```
### Step 2 · What the computer actually sees
This is the whole input for one piece of text: **224 numbers**, one per small word, always in the same order. No topic, no meaning, no sentences.

In machine learning, these numbers are called **features**: the measurable things the computer is allowed to look at.

**What you'll see:** the first 24 of the 224 numbers. The order follows the word list from Step 0: `a`, `about`, `above`, ...
```python
piece = np.array(D["t2"]["counts"][0])           # Ted's 1971 essay, piece 1: 224 numbers
piece[:24]
```
### Step 3 · Draw that piece
Numbers are easier to read as a picture. Here are the 15 small words this piece uses most.

**What you'll see:** "the", "of" and "to" lead, as in almost any English text. The differences between writers hide further down, in how often they use words like *which*, *because* or *any*.

**Try it:** change `[0]` to `[3]` to draw piece 4 instead.
```python
piece = np.array(D["t2"]["counts"][0])
H.show_plot(G.piece_bars(piece, fw))
int(piece.sum())                     # how many of the 1,000 words are small words
```
### Step 4 · Ted's small-word habits
Now compare writers. Each row is one small word. Each dot is how often a writer uses it **per 1,000 words**: 19 other writers (grey), Ted's 1971 essay (blue diamond), and the manifesto (orange star).

**What you'll see:** in some rows the diamond and the star sit together, away from the grey crowd. That is a habit Ted carried from 1971 into the manifesto.

**Try it:** put other words in the list, e.g. `"which"`, `"of"`, `"however"`, and run again.
```python
WORDS = ["because", "any", "and", "the"]
H.show_plot(G.dot_strip(D, WORDS))
```
### Step 5 · Build the training table
Machine learning learns from examples with the right answers. We need two things:

- **X**, a table of features: one row per piece, one column per small word.
- **y**, the **labels** (the right answers): 1 for "Ted", 0 for "not Ted".

We use Ted's 1971 essay and the 29 texts by other writers. Ted's later essays and the manifesto stay out: the computer must never see them while learning.

**What you'll see:** the size of the table, rows by columns.
```python
T = G.counts(D["t2"])                                   # Ted's 6 pieces
I = np.vstack([G.counts(r) for r in D["impostors"]])    # the other writers' 282 pieces

X = np.vstack([T, I])                                   # stack them: Ted first, then the others
y = np.r_[np.ones(len(T)), np.zeros(len(I))]            # 1 for each Ted piece, 0 for each other piece

print("labels of the first 10 rows:", y[:10].astype(int))
X.shape                                                 # (rows, columns)
```
### Step 6 · Look at a corner of the table
A table this big is hard to read, so here is one corner: 6 Ted pieces above the line, 6 other-writer pieces below, and 16 of the 224 columns. Darker = used more. The column **y** on the right holds the answers.

**What you'll see:** some columns already differ: look at *will*, high in every Ted row. But one column is not enough to decide. The computer's job is to combine all 224 columns into one judgement.
```python
H.show_plot(G.table_heatmap(X, fw, n_ted=len(T)))
```
### Step 7 · Turn counts into shares
Some pieces happen to contain more small words overall. To compare fairly, we divide each row by its total, so every row adds up to 1. A count of 65 "the" becomes a **share**: "the" is 12.5% of this piece's small words.

This tool is called a **Normalizer**. Tools in scikit-learn (the machine-learning library we use) all work the same way: `fit` looks at the data, `transform` changes it.

**What you'll see:** one row before and after; the shares add up to 1.
```python
from sklearn.preprocessing import Normalizer

shares = Normalizer(norm="l1").fit_transform(X)        # divide each row by its total

show = ["the", "of", "and", "which", "because", "any"]
cols = [fw.index(w) for w in show]
print("counts:", X[0, cols].astype(int))
print("shares:", shares[0, cols].round(3))
shares[0].sum()                                          # every row now adds up to 1
```
### Step 8 · Put every word on the same scale
"the" fills about 13% of small words; "because" fills 0.2%. Left like this, big words would drown out small ones.

So we **rescale** each column: subtract its average and divide by its usual spread. After that, 0 means "as usual", +1 means "a bit more than usual", -1 "a bit less", for every word alike. This tool is a **StandardScaler**.

**What you'll see:** top row, the raw shares of "the" and "because" across all 288 pieces (very different ranges); bottom row, the same words after rescaling, both centred on 0.
```python
from sklearn.preprocessing import StandardScaler

scaled = StandardScaler().fit_transform(shares)
H.show_plot(G.scale_hist(shares, scaled, fw))
{w: round(float(v), 2) for w, v in zip(show, scaled[0, cols])}     # piece 1, after rescaling
```
### Step 9 · Who writes most like the manifesto?
Before any training, a first look. For each writer we take the average of all their pieces (after Steps 7 and 8), which gives one **profile** of 224 numbers per writer. Then we measure how closely each profile points the same way as the manifesto's. This measure is called **cosine similarity**: 1 means the same pattern, 0 means unrelated, below 0 means opposite habits.

The manifesto is not used to make the profiles; we only compare against it.

**What you'll see:** 20 bars, one per writer. Ted's 1971 essay (blue) is far ahead of the 19 other writers, who wrote about the same topics in the same decades.
```python
fig, rank = G.similarity_rank(D, X, n_ted=len(T))
H.show_plot(fig)
[(name, round(sim, 2)) for name, sim in rank[:3]]      # the three closest writers, with their similarity
```
### Step 10 · Train the model
Now the computer learns. **Logistic regression** gives every small word a **weight**. To score a piece, it multiplies each word's (rescaled) value by its weight and adds everything up: a big total means "Ted", a low total means "not Ted".

**Training** means finding the weights that make Ted's pieces score high and the others score low. `fit` does it in a second.

We chain the three tools (shares, rescale, logistic regression) into one **pipeline**, so new text always goes through the same steps.

**What you'll see:** the pipeline, then the model's answers for a few training pieces.
```python
model = G.make_model()          # Normalizer -> StandardScaler -> LogisticRegression
model.fit(X, y)                 # learning happens here

print("answers for the first 3 Ted pieces:         ", model.predict(T[:3]).astype(int))
print("answers for the first 3 other-writer pieces:", model.predict(I[:3]).astype(int))
model
```
### Step 11 · Look inside: which words say "Ted"?
Each word got a **weight**. Blue bars push a piece toward "Ted"; grey bars push it away.

**What you'll see:** future-tense and argument words such as *will* and *be* on Ted's side; this is how a writer who argues about where society is heading sounds.

**Try it:** change `k=12` to `k=20` to see more words.
```python
w = model[-1].coef_[0]            # the 224 learned weights, in the order of fw
H.show_plot(G.weight_bars(w, fw, k=12))
fw[int(np.argmax(w))]             # the single most Ted-like word
```
### Step 12 · Score one piece it has never seen
Ted wrote this essay in prison, decades after 1971. The model never saw it.

The model's **score** for a piece is that weighted sum. The higher, the more like Ted. A score means little alone, so we compare it with the pieces the model trained on.

**What you'll see:** this unseen piece scores far above the other writers' average and below Ted's own 1971 pieces.
```python
essay = D["ted_post"][0]
P = G.counts(essay)                                      # its pieces, one row each

print(f'{essay["title"]} ({essay["year"]}), piece 1')
print(f"   training average, Ted's 1971 essay: {model.decision_function(T).mean():+.2f}")
print(f"   training average, other writers:    {model.decision_function(I).mean():+.2f}")
model.decision_function(P[:1])[0]                        # the new piece's score
```
### Step 13 · Take that score apart
A score is just many small pushes added up: for each word, weight × how much more (or less) than usual this piece uses it.

**What you'll see:** the words that pushed this piece's score up (blue) and down (grey). Adding all 224 pushes, plus a fixed starting value, gives exactly the score from Step 12.
```python
fig, total = G.contributions(model, P[0], fw)
H.show_plot(fig)
round(total, 2)                   # the same number as in Step 12
```
### Step 14 · Score a whole text
One piece can be noisy. For a whole text we score **every** piece and take the average.

**What you'll see:** the four piece scores, then the whole-text score.
```python
scores = model.decision_function(P)
print("score of each piece:", scores.round(2))
scores.mean()                     # the whole-text score
```
### Step 15 · A fair test, and the alarm line
How high must a score be before we say "Ted"? We ask the other writers.

There is a catch: a model gives high marks to texts it has already seen, like a student who memorized the answer key. So each other-writer text must be scored by a model trained **without** it. We split their texts into 5 groups and train 5 times, each time holding one group out. This is called **cross-validation**.

The **alarm line** is set so that only 1 in 20 of their texts crosses it.

**What you'll see:** the 5 rounds, then the alarm line.
```python
groups = np.array([r["author"] + "/" + r["text"] for r in D["impostors"] for _ in r["n"]])
held = np.zeros(len(I))
for rnd, (train, test) in enumerate(G.group_folds(groups), 1):       # whole texts stay together
    m = G.make_model().fit(np.vstack([T, I[train]]), np.r_[np.ones(len(T)), np.zeros(len(train))])
    held[test] = m.decision_function(I[test])                       # scores from a model that never saw them
    print(f"round {rnd}: trained without {len(test)} pieces, then scored them")

texts = sorted(set(groups))
others = np.array([held[groups == g].mean() for g in texts])         # one score per whole text
line = float(np.quantile(others, 0.95))                               # only 1 in 20 above it
line
```
### Step 16 · See the alarm line
**What you'll see:** the 29 other-writer texts as a histogram (how many texts got each score), and the dashed alarm line near their top edge.
```python
H.show_plot(G.alarm_hist(others, line))
```
### Step 17 · Score Ted's later essays and the manifesto
Now the real test. Ted's later essays are a **check**: we know he wrote them, so they should cross the line. The manifesto is the **question**.

**What you'll see:** one row per text, its score, and whether it crosses the alarm line.
```python
later = np.array([model.decision_function(G.counts(r)).mean() for r in D["ted_post"]])
manifesto = float(model.decision_function(G.counts(D["u14"])).mean())

rows = [[r["title"][:52], r["year"], f"{s:+.2f}", "yes" if s > line else "no"] for r, s in zip(D["ted_post"], later)]
rows.append(["The manifesto", 1995, f"{manifesto:+.2f}", "YES" if manifesto > line else "no"])
H.show_table(["text", "year", "score", "flagged?"], rows, f"Alarm line = {line:.2f}")
```
### Step 18 · Draw the picture
Everything in one picture. Each dot is one **whole text**; everything right of the dashed **alarm line** is flagged as Ted. This is the figure from the lecture, and you just made it.

**What you'll see:** grey dots mostly left of the line, blue diamonds mostly right, and the orange star far right.
```python
r = {"others": others, "later": later, "manifesto": manifesto, "line": line}
H.show_plot(G.score_plot(r))

print(f"Other writers flagged:      {int((others > line).sum())} of {len(others)}")
print(f"Ted's later essays flagged: {int((later > line).sum())} of {len(later)}")
print("The manifesto:", "flagged" if manifesto > line else "not flagged")
```
### Step 19 · Move the alarm line yourself
The alarm line is a choice. A lower line catches more of Ted's essays but also flags more innocent writers; a higher line does the opposite.

**What you'll see:** for four lines, how many of each group cross it.

**Try it:** add `0.75` to the list.
```python
for q in [0.80, 0.90, 0.95, 1.00]:                      # 1.00 = above every other writer
    cut = np.quantile(others, q)
    print(f"line at the {int(q * 100)}th percentile ({cut:+.2f}):  "
          f"other writers {int((others > cut).sum()):2d}/29 | later essays {int((later > cut).sum())}/8 | manifesto {'yes' if manifesto > cut else 'no'}")
```
### You just finished a machine-learning project
- **Features:** you turned texts into numbers (224 small-word counts), then into shares on one scale.
- **Labels:** you gave the right answers (Ted or not).
- **Training:** logistic regression learned a weight for every word.
- **Looking inside:** you saw which words say "Ted" and how one score adds up.
- **Testing:** you scored texts the model never saw, and set an alarm line with cross-validation.
- **Decision:** it flagged Ted's later essays and the manifesto, and passed almost every other writer.

In 1996 the FBI compared these texts by hand. You did it in a few minutes. Stuck on a step, or curious why? Ask **B'lawd**, bottom right.
Credits: Data: derived function-word counts built from the Ted K Archive texts and an FBI-document transcription of the 1971 essay (see data notes). No impostor or post-arrest text is shipped, only counts. The two short quotations are shown for illustration with attribution. Method: `unabom/scripts/text_level.py`.

---

## Case 3 · The Lu Xun brothers (open with #ch3)
**The story.** Lu Xun (the pen name of Zhou Shuren, 1881-1936) and his younger brother Zhou Zuoren (1885-1967) became two of the best-known Chinese writers of the twentieth century.
In 1907-08 they were young men in Tokyo, writing essays together in **classical Chinese**: the dense old written language of scholars, with no spaces between words and many tiny grammar words.
Some of those essays were published under shared or uncertain names. Four of them appeared under the pen name **Du Ying** (or Du), and scholars have argued about which brother wrote them, or whether both did.

**Our question:** can a computer learn each brother's small-word habits from essays he certainly wrote, and then say which habits the disputed four show?
English has *of*, *and*, *not*. Classical Chinese has **之** ("of"), **而** ("and, yet"), **矣** (a sentence-ending particle), **惟** ("only"), and many more.
We count 31 of these small characters and short words. This is your first machine-learning project, and it follows the method of Xie, Li and Wang (2024), the same idea as Case 1 in another language.

You do not need to read Chinese. Every character comes with its English meaning.
### Step 0 · Open the box
Click the round **▶** next to a code box to run it, from top to bottom. Every box prints what it did.

The essays we are certain about are cut into **pieces** of about 1,000 characters, so the computer gets many examples to learn from.
Some pieces are **certain**: we know which brother wrote them. We use 31 of them to **train** the model (to teach it), and keep 30 back as a **validation** set (to test it later on pieces it has never seen).
The last group is the **disputed** essays, the question we care about: 4 essays.

**What you'll see:** how many pieces are in each group, and how many characters each brother has in the training set.
```python
import numpy as np
import lab_helpers as H                   # small display helpers written for this lab
import lab_ch3 as Z                       # the 31 characters, the counting code and the plots

corpus = H.load_json("data/ch3/corpus.json")
docs, translation = corpus["docs"], corpus["translations"]
train = [d for d in docs if d["split"] == "train"]      # certain: used to teach the model
val = [d for d in docs if d["split"] == "val"]          # certain: kept back to test the model
test = [d for d in docs if d["split"] == "test"]        # the four disputed essays

print(f"train: {len(train)} pieces | validation: {len(val)} pieces | disputed essays: {len(test)}")
print("train characters  Lu Xun:", sum(Z.length(d["text"]) for d in train if d["author"] == "lx"),
      "| Zhou Zuoren:", sum(Z.length(d["text"]) for d in train if d["author"] == "zzr"))
```
### Step 1 · Read one piece from each brother
Here is the opening of a certain piece by each brother, in orange (Lu Xun) and blue (Zhou Zuoren), and the opening of one disputed essay with an English translation.

Can you tell them apart? A scholar who reads classical Chinese could argue for either brother. A computer will look at something a reader does not notice.

**What you'll see:** three short Chinese passages, and the start of the English translation of the disputed one.

**Try it:** change the `[0]` to `[5]` to read another piece by the same brother.
```python
lx = [d for d in train if d["author"] == "lx"][0]           # a certain Lu Xun piece
zzr = [d for d in train if d["author"] == "zzr"][0]         # a certain Zhou Zuoren piece
disputed = next(d for d in test if d["title"] == "望华国篇")    # one disputed essay

H.show_html(Z.passage_html("Lu Xun (certain)", lx["text"][:90].replace("\n", "") + " ...", Z.ORANGE))
H.show_html(Z.passage_html("Zhou Zuoren (certain)", zzr["text"][:90].replace("\n", "") + " ...", Z.BLUE))
H.show_html(Z.passage_html("Disputed: 望华国篇", disputed["text"][:90].replace("\n", "") + " ...", Z.INK))
H.show_html(Z.gloss_html("English translation: " + " ".join(translation["望华国篇"].split("\n")[1].split()[:40]) + " ..."))
```
### Step 2 · Meet the 31 small characters
A **function character** is a tiny grammar word. It carries no topic. It holds the sentence together, the way *of*, *and*, *not*, *only* do in English.
Every writer leans on a favourite handful without noticing, and that is a fingerprint.

The study picked 31 characters and short words that help tell the brothers apart: 27 single characters and 4 two-character words. Each has a rough English meaning below.

**What you'll see:** a table of the 31, with their meanings.
```python
rows = []
for g in Z.GRAMS:
    kind = "one character" if len(g) == 1 else "two-character word"
    rows.append([g, Z.GLOSS[g], kind])
H.show_table(["character", "rough English meaning", "kind"], rows, "The 31 features")
```
### Step 3 · Spot them in a passage
Here is the opening of the Lu Xun piece again. This time every one of the 31 characters is marked in green.

The marked characters are not the "important" words. They are the glue, and they are everywhere. That is why a writer cannot hide them.

**What you'll see:** the passage with the glue characters marked, and how many there are. Hover over a marked character to see its English meaning.

**Try it:** change `lx` to `zzr` to mark the same characters in the Zhou Zuoren piece.
```python
text = lx["text"][:140].replace("\n", "")          # the first 140 characters

H.show_html(Z.legend_html(weighted=False))
H.show_html(Z.highlight_html(text, Z.GRAMS))
n_marked = sum(Z.count_frequency(Z.GRAMS, text))      # how many marked characters
print(f"{n_marked} of the {Z.length(text)} characters in this passage are among the 31")
```
### Step 4 · Count, and why "per 1,000"
To turn a text into numbers, we **count** how many times each of the 31 appears. Here is a disputed essay, with five of the counts.
(A short character is never counted twice: the **是** inside **于是** counts only as 于是.)

A long essay has more of everything, so raw counts are unfair. We divide by the length and report **how many per 1,000 characters**. Now a long essay and a short one can be compared.

**What you'll see:** counts for 望华国篇, then the same character, 之 ("of"), counted in a long and a short essay.

**Try it:** change `title` to 民国之征何在 and run again.
```python
title = "望华国篇"                                                          # change me: 尔越人毋忘先民之训, 望越篇, 民国之征何在
essay = next(d for d in test if d["title"] == title)["text"]
shown = ["之", "而", "矣", "惟", "于"]
counts = Z.count_frequency(Z.GRAMS, essay)                                # one count for each of the 31
print(title + ",", Z.length(essay), "characters. Counts:", dict(zip(shown, [counts[Z.GRAMS.index(g)] for g in shown])))

short = next(d for d in test if d["title"] == "尔越人毋忘先民之训")["text"]   # a shorter essay
for name, t in [(title, essay), ("尔越人毋忘先民之训", short)]:
    n = Z.count_frequency(Z.GRAMS, t)[Z.GRAMS.index("之")]
    print(f"{name}: 之 appears {n} times in {Z.length(t)} characters = {n / Z.length(t) * 1000:.1f} per 1,000")
```
### Step 5 · Count for each brother
Now we count over everything each brother certainly wrote (the training pieces), per 1,000 characters.
If one brother always writes **之** more often than the other, that is a clue, a weak one on its own. With 31 characters we get 31 clues.

**What you'll see:** a table sorted from the characters Lu Xun uses much more than his brother (top) to the ones Zhou Zuoren uses more (bottom).
```python
def per_thousand(author):
    text = "".join(d["text"] for d in train if d["author"] == author)    # all the training text of one brother
    return Z.rates_per_1000(text)

lx_rate, zzr_rate = per_thousand("lx"), per_thousand("zzr")
order = np.argsort(-(np.array(lx_rate) - np.array(zzr_rate)))          # biggest Lu Xun-over-Zhou gap first
rows = [[Z.GRAMS[k], f"{lx_rate[k]:.1f}", f"{zzr_rate[k]:.1f}"] for k in order]
H.show_table(["character", "Lu Xun (per 1,000)", "Zhou Zuoren (per 1,000)"], rows, "All 31 features, sorted by how much more Lu Xun uses them")
```
### Step 6 · Draw the 31 rates
A table of 62 numbers is hard to take in. A picture is not. Each row is one character with its English meaning; the orange bar is Lu Xun, the blue bar is Zhou Zuoren.

**What you'll see:** rows where the orange bar is much longer or shorter than the blue bar. Those are the characters that tell the brothers apart.
```python
H.show_plot(Z.rates_plot(lx_rate, zzr_rate))
```
### Step 7 · The biggest differences
Now we draw only the gap between the brothers: Lu Xun's rate minus Zhou Zuoren's. Bars to the right (orange) are characters Lu Xun uses more; bars to the left (blue) are characters Zhou Zuoren uses more.

**What you'll see:** the 12 biggest gaps, with the longest bars at the top and bottom.

**Try it:** change `k=12` to `k=6` for just the six biggest gaps.
```python
H.show_plot(Z.gap_plot(lx_rate, zzr_rate, k=12))
```
### Step 8 · Build X and y
Machine learning needs two things. A table of numbers **X**: one row per piece, one column per character. These are called the **features**.
And the right answers **y**: one label per piece, 1 for Lu Xun and 0 for Zhou Zuoren. These are called the **labels**.

Each number in X is a count divided by the piece's length (0.012 means 12 per 1,000). It is a coincidence that there are 31 pieces and 31 characters: rows are pieces, columns are characters. Everything the computer will ever know about a piece is its row of 31 numbers.

**What you'll see:** the size of each table, one row of numbers, and the first twelve labels.
```python
X_train = np.array(Z.features([d["text"] for d in train]))      # features: one row per piece, 31 columns
y_train = np.array([int(d["author"] == "lx") for d in train])    # labels: 1 = Lu Xun, 0 = Zhou Zuoren
X_val = np.array(Z.features([d["text"] for d in val]))
y_val = np.array([int(d["author"] == "lx") for d in val])
X_test = np.array(Z.features([d["text"] for d in test]))         # the disputed essays have no labels
names = [d["title"] for d in test]

print("X_train has", X_train.shape[0], "rows (pieces) and", X_train.shape[1], "columns (characters)")
print("the first piece, first 5 columns", Z.GRAMS[:5], "per 1,000:", (X_train[0][:5] * 1000).round(1))
print("the first twelve answers (1 = Lu Xun, 0 = Zhou Zuoren):")
y_train[:12]
```
### Step 9 · Two characters, every piece
With 31 columns we cannot draw a picture, so we start with two. The code picks the two characters whose averages differ most between the brothers.
Each dot is one training piece. Its position says how often the piece uses each of the two characters. The stars are each brother's average. The numbered black discs are the four disputed essays (listed under the plot); they did not help pick the two characters.

**What you'll see:** orange and blue dots that already sit in somewhat different places, and also overlap, with the four disputed essays among them. Two characters are a start, not an answer.

**Try it:** replace the first line with `a, b = Z.GRAMS.index("而"), Z.GRAMS.index("矣")` to compare other characters.
```python
a, b = Z.most_telling(X_train, y_train)          # indices of the two most telling characters
print("the two most telling characters:", Z.GRAMS[a], f"({Z.GLOSS[Z.GRAMS[a]]})", "and", Z.GRAMS[b], f"({Z.GLOSS[Z.GRAMS[b]]})")
H.show_plot(Z.two_char_plot(X_train, y_train, a, b, X_test, names))
```
### Step 10 · Put every character on the same scale
Some characters are common (之) and some are rare (惟). Rare ones would barely count. So we rescale every column: 0 means "as usual for these pieces", +1 means "a bit more than usual", -1 "a bit less".
The tool that does it is called a **StandardScaler**. It learns each column's average and spread from the training pieces only.

**What you'll see:** the average and spread of two characters before and after rescaling, and one piece in the new units.
```python
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler().fit(X_train)              # learns each column's average and spread
S_train = scaler.transform(X_train)                 # the same table, rescaled

for g in ["之", "惟"]:
    j = Z.GRAMS.index(g)
    print(f"{g}: before, average {X_train[:, j].mean() * 1000:.1f} per 1,000, spread {X_train[:, j].std() * 1000:.1f}"
          f"   |   after, average {S_train[:, j].mean():.1f}, spread {S_train[:, j].std():.1f}")
print("first piece after rescaling:", {g: round(float(S_train[0][Z.GRAMS.index(g)]), 2) for g in ["之", "惟", "而"]})
```
### Step 11 · A map of all the pieces
Can we see all 31 columns at once? **PCA** squashes 31 numbers into 2, keeping as much of the difference between pieces as it can. The result is a map: pieces that use the characters alike sit close together.
The map is not told who wrote what. We only colour the dots afterwards: orange for Lu Xun, blue for Zhou Zuoren.

**What you'll see:** an orange cloud and a blue cloud with a gap between them, then the share of the variation each map direction keeps. The model's job is to find that dividing line across all 31 columns.
```python
from sklearn.decomposition import PCA

pca = PCA(n_components=2).fit(S_train)              # finds the two directions with the most variation
H.show_plot(Z.pca_map(pca, S_train, y_train))
pca.explained_variance_ratio_.round(2)              # the share of the variation each map direction keeps
```
### Step 12 · Train the model
Now the computer learns. **Logistic regression** gives each of the 31 characters a **weight**. For a piece, it multiplies each rescaled number by its weight and adds them up; the total is the piece's **score**.
Training means finding the weights that give Lu Xun's training pieces high scores and Zhou Zuoren's low scores. The **L2** setting is a gentle brake that stops any one weight from growing too big.
We put the rescaling and the regression into one **pipeline**.

**What you'll see:** the model's answers for three Lu Xun pieces and three Zhou Zuoren pieces, next to the true answers.
```python
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression

clf = Pipeline([("scale", StandardScaler()),
                ("lr", LogisticRegression(penalty="l2", C=1.0, solver="lbfgs", tol=1e-9, max_iter=10**6))])
clf.fit(X_train, y_train)                            # learning happens here

some = [0, 1, 2, 17, 18, 19]                         # three Lu Xun pieces, then three Zhou Zuoren pieces
print("true answers:       ", y_train[some])
print("the model's answers:")
clf.predict(X_train[some])
```
### Step 13 · From a score to a probability
A score is hard to read, so it is turned into a **probability** with an S-shaped curve: **P(Lu Xun)**. A score of 0 gives 50%, "no lean either way". A high score gives a number near 1, a very negative score gives a number near 0.
Probability here means how strongly the model leans, from 0 (Zhou Zuoren) to 1 (Lu Xun).

**What you'll see:** the score and probability of two training pieces, and a curve with all 31 training pieces sitting on it.
```python
scores = clf.decision_function(X_train)            # one score per training piece
p_train = clf.predict_proba(X_train)[:, 1]         # the same pieces as probabilities of Lu Xun

print(f"piece 0 (Lu Xun):       score {scores[0]:+.2f}  ->  P(Lu Xun) = {p_train[0]:.3f}")
print(f"piece 17 (Zhou Zuoren): score {scores[17]:+.2f}  ->  P(Lu Xun) = {p_train[17]:.3f}")
H.show_plot(Z.score_curve(scores, y_train))
```
### Step 14 · Look inside: what did it learn?
Each character now has a weight. A positive weight (orange) pushes a piece towards Lu Xun; a negative weight (blue) pushes it towards Zhou Zuoren. Because every column was rescaled, the weights are comparable.
No single character decides. The verdict is a sum of many small pushes.

**What you'll see:** all 31 weights as bars, then the single most Lu Xun-like character.
```python
weights = clf.named_steps["lr"].coef_[0]          # the 31 learned weights
H.show_plot(Z.weights_plot(weights))
Z.GRAMS[int(np.argmax(weights))]                 # the single most Lu Xun-like character
```
### Step 15 · A check on pieces it has never seen
Before we trust the model on the disputed essays, we test it on the 30 validation pieces. We know who wrote them, and the model never saw them, so they are **held out**. This is a **check**: if the model cannot name the author when we know the answer, it cannot be trusted when we do not.
**Accuracy** is the share of pieces it got right. The **confusion matrix** counts the hits and misses for each brother.

**What you'll see:** the model's accuracy and, for each brother, how many of his pieces it got right.
```python
from sklearn.metrics import accuracy_score, f1_score, confusion_matrix

pred = clf.predict(X_val)                            # the model's answers for the held-out pieces
print(f"validation accuracy = {accuracy_score(y_val, pred):.3f}   (published: 0.933)")
print(f"F1 for Lu Xun       = {f1_score(y_val, pred):.3f}   (published: 0.964)")
cm = confusion_matrix(y_val, pred)
print("confusion matrix (rows = truth Zhou, Lu Xun; columns = predicted Zhou, Lu Xun):")
print(cm)
print(f"Lu Xun pieces right: {cm[1, 1]} of {cm[1].sum()}   |   Zhou Zuoren pieces right: {cm[0, 0]} of {cm[0].sum()}")
```
### Step 16 · Draw the check
Each dot is one held-out piece, placed by the model's P(Lu Xun). The top row holds the pieces Lu Xun really wrote, the bottom row the ones Zhou Zuoren really wrote. A dot on the correct side of the dashed 50% line is a hit; a ringed dot is a miss.

**What you'll see:** 27 of the 28 orange dots on the Lu Xun side, and 1 of the 2 blue dots on the Zhou Zuoren side. The two misses are ringed.
```python
p_val = clf.predict_proba(X_val)[:, 1]                # P(Lu Xun) for every validation piece
H.show_plot(Z.check_plot(p_val, y_val))
```
### Step 17 · Now the question: the four disputed essays
Now the question that started the study. We give the model the four disputed essays, whose authors nobody can confirm, and read off its **P(Lu Xun)** for each.
The English title comes from the repository's translation. The last column shows the numbers quoted in the paper's repository, which our run reproduces.

**What you'll see:** four essays, sorted from the one the model leans towards Lu Xun most to the one it leans least.
```python
probs = clf.predict_proba(X_test)[:, 1]                 # probability of Lu Xun
published = {"望华国篇": 0.984, "望越篇": 0.856}            # numbers quoted in the repository README
rows = []
for d, p in sorted(zip(test, probs), key=lambda t: -t[1]):
    title_en = translation[d["title"]].split("\n")[0]
    rows.append([d["title"], title_en, Z.length(d["text"]), f"{p:.3f}", published.get(d["title"], "-")])
H.show_table(["essay", "English title", "characters", "P(Lu Xun)", "published"], rows, "Disputed essays")
```
### Step 18 · Put the disputed essays on the map
Back to the map from Step 11. We add the held-out pieces (hollow triangles) and the four disputed essays (black discs, numbered 1 to 4 and listed under the map), each placed with the same squashing and rescaling.

**What you'll see:** whether each numbered disc lands among the orange pieces, among the blue pieces, or in between.
```python
S_val = scaler.transform(X_val)                       # the same rescaling as for training
S_test = scaler.transform(X_test)
H.show_plot(Z.pca_map(pca, S_train, y_train, S_val, y_val, S_test, names))
```
### Step 19 · See it in the text
Back to the text. Every feature character in the essay is marked: **orange favours Lu Xun, blue favours Zhou Zuoren**; the darker the shade, the larger the weight. Below it is the English translation of the whole essay.

**What you'll see:** an essay full of marks of both colours; the model adds them all up.

**Try it:** change the title to 望越篇, 尔越人毋忘先民之训 or 民国之征何在.
```python
title = "望华国篇"                                        # change me: 尔越人毋忘先民之训, 望越篇, 民国之征何在
d = next(d for d in test if d["title"] == title)
print(f"{title}: P(Lu Xun) = {probs[test.index(d)]:.3f}")
H.show_html(Z.legend_html(weighted=True))
H.show_html(Z.highlight_html(d["text"], Z.GRAMS, weights))
H.show_html(Z.gloss_html(translation[title]))
```
### Step 20 · What pushed the verdict?
The score of an essay is a plain sum: a starting point, plus one push per character. Each push is the character's weight times how unusual the character is in this essay.
Add them all and you get the score the model reports.

**What you'll see:** the sum worked out in numbers, the eight biggest pushes in the essay from Step 19 as bars, and all 31 pushes as numbers.
```python
i = names.index(title)                               # the essay chosen in Step 19
lr = clf.named_steps["lr"]
pushes = lr.coef_[0] * S_test[i]                     # weight x how unusual, one push per character
start = lr.intercept_[0]                             # the starting point

print(f"starting point {start:+.2f} + the 31 pushes {pushes.sum():+.2f} = score {start + pushes.sum():+.2f}")
print(f"the model's own score: {clf.decision_function(X_test[i:i + 1])[0]:+.2f}  ->  P(Lu Xun) = {probs[i]:.3f}")
H.show_plot(Z.push_plot(pushes, title))
pushes.round(2)                                      # all 31 pushes
```
### Step 21 · Draw the verdict
The big picture. One row per disputed essay: the bar is split into the model's P(Zhou Zuoren) in blue and P(Lu Xun) in orange. The dashed line at 50% is "no lean either way".

**What you'll see:** all four essays on the same scale, from the strongest lean to the weakest.
```python
order = np.argsort(-probs)                              # strongest Lu Xun lean first
titles_zh = [test[k]["title"] for k in order]
titles_en = [translation[test[k]["title"]].split("\n")[0] for k in order]
H.show_plot(Z.verdict_plot(titles_zh, titles_en, probs[order]))
```
### You just finished a machine-learning project
- **Features:** you turned essays into numbers (31 small-character rates).
- **Labels:** you gave the right answers (Lu Xun or Zhou Zuoren) for pieces you were certain about.
- **Training:** logistic regression learned a weight for every character.
- **Testing:** you checked it on 30 held-out pieces before using it.
- **Decision:** it leans towards Lu Xun on all four disputed essays, from 0.984 for 望华国篇 down to 0.595 for 民国之征何在.

The same recipe as Case 1 (count small habits, fit a regression, read the weights) works in another language and another century.

Stuck on a step, or curious why? Ask **B'lawd**, bottom right.
Credits: Texts and English translations: the_many_voices (corpus dedicated to the public domain, other materials 0BSD). Method: Xie Xin, Li Jiangqiong and Haining Wang, *The many voices of Du Ying: revisiting the disputed writings of Lu Xun and Zhou Zuoren*, Digital Scholarship in the Humanities 40(1), 2024. Chinese font in the plots: a small subset of Noto Sans SC (SIL Open Font License 1.1, see data/ch3/FONT_LICENSE.txt).

---

## Case 4 · Protect John Doe (open with #ch4)
**What happened.** An anonymous online review titled "A Scandal" criticized the game company Machine Zone. Machine Zone sued the anonymous poster, "John Doe" (described by the court as a former employee), and tried to obtain his identity from the review website.
The California Court of Appeal (2017) ruled against forcing disclosure, because Machine Zone had not made the required showing that the review broke his confidentiality agreement.

> **Everything below is a "what if".** The court did not use stylometry. We ask: what if the company had used a computer to compare the review with its employees' writing?

**You are on John Doe's side.** You are the defender. The attacker is a small program that learned the small-word habits of **45 possible writers**. If it names John Doe first, he is exposed.
**You win** when the attacker can no longer pick John Doe, **and** the review still says the same thing.

**The plan.** First we see how exposed John Doe is: the attack with no defense is our baseline. Then we try disguises: writing differently by hand, and ready-made rewrites by language models (a translation round trip, simple English, a McCarthy-style rewrite). Last, you write your own disguise and see if it works.

**What we use.** We do not have the real review, so John Doe here is a stand-in: one of 45 volunteer writers in the **Extended Brennan-Greenstadt (EBG)** corpus. Each volunteer supplied about 15 pieces of earlier writing (roughly 500 words each).
The attacker is the same simple one as in Case 1: **224 small words + logistic regression**. The rewrites are ready-made, so you need no account.
### Step 0 · Open the box: 45 writers and one review
Click the round **▶** next to a code box to run it, from top to bottom.

The box holds the writing of **45 candidates**. The attacker will use each person's earlier writing (**training pieces**) to learn their habits. One more text per person is kept aside, the **held-out text**: it plays the role of the anonymous review.

**What you'll see:** how many writers and pieces there are.
```python
import json
import numpy as np
import lab_helpers as H                     # small display helpers written for this lab
import lab_ch4 as R                         # the EBG loader, the attacker and the plots of this case

authors, train, test, obf, _ = R.load_ebg()           # every file is checked against its SHA-256
words = H.load_fw224()                                # the 224 small words (as in Case 1)
train_texts = [t for a in authors for t in train[a]]  # the earlier writing, one text per piece
train_labels = [a for a in authors for t in train[a]] # who wrote each piece

print(len(authors), "candidates,", len(train_texts), "training pieces")
print(len(test), "held-out texts, about", round(np.mean([len(R.words(t)) for t in test.values()])), "words each")
authors[:10]
```
### Step 1 · Read one writer's earlier writing
This is the raw material: ordinary writing, about 500 words a piece. The attacker never reads it for its meaning. It only counts small words.

**What you'll see:** the start of one training piece by candidate `aa`.
**Try it:** change `"aa"` to another candidate from the list above.
```python
who = "aa"                                  # try another candidate
piece = train[who][0]                       # the first training piece of this writer
print(len(train[who]), "pieces by", who, "| this one has", len(piece.split()), "words\n")
print(piece.strip()[:600], "...")
```
### Step 2 · Turn a text into 224 numbers
A computer cannot judge a style by feel, so we turn each text into numbers. We count how often each of **224 small words** appears (*the, of, and, which, because, ...*). These words carry no topic, but every writer uses them in a personal way.
A list of numbers describing one text is called its **features**.

**What you'll see:** the 224 counts of one piece, and its ten most used small words.
```python
counts = H.fw_counts(piece, words)          # 224 numbers: how often each small word appears
print("The piece becomes a list of", len(counts), "numbers:")
print(counts[:20], "...\n")
top = sorted(zip(words, counts), key=lambda p: -p[1])[:10]
print("its ten most used small words:", top)
len(counts)
```
### Step 3 · See the small-word habits of all 45 writers
Each dot is one writer: how often they use a small word **per 100 words**, over all their earlier writing. The dots spread out. That spread is what the attacker uses: a writer who sits far from the crowd on many words is easy to spot.

**What you'll see:** one row per word, 45 grey dots per row.
**Try it:** change the word list (for example `"which"`, `"however"`, `"very"`).
```python
WORDS = ["the", "that", "to", "and"]          # try other small words
known = {a: R.rates(train[a], WORDS) for a in authors}      # each writer's habit: times per 100 words
H.show_plot(R.strip_plot(known, None, None, WORDS, "Every writer has small-word habits"))
```
### Step 4 · Build X and y for the attacker
Machine learning needs two things: a table of numbers **X** (one row per training piece, one column per small word) and the right answers **y** (who wrote each piece).
The attacker learns from them.

**What you'll see:** the size of X and the first answers in y.
```python
X = np.array([H.fw_counts(t, words) for t in train_texts])   # the table: 1 row per piece
y = np.array(train_labels)                                      # the right answers: who wrote it

print("X has", X.shape[0], "rows (pieces) and", X.shape[1], "columns (small words)")
print("the first 8 answers in y:", y[:8])
X.shape
```
### Step 5 · Train the attacker
**Training** means the computer adjusts itself until it can tell the 45 writers apart on the pieces it studies. Our attacker does three things: it turns counts into **shares** (so a long text is not "louder" than a short one), puts every word on the same scale, and fits a **logistic regression**, which gives each word a weight for each writer.
For any new text, it answers with a **probability for each of the 45 candidates**. The probabilities add up to 1.

**What you'll see:** the attacker trains in a few seconds, and its probabilities for one text.
```python
a1 = R.FW224Attacker(train_texts, train_labels, words)    # shares -> same scale -> logistic regression

p = a1.scores(test["aa"])                    # one probability per candidate, for the held-out text of "aa"
print("the attacker gives", len(p), "probabilities; together they add up to", round(sum(p.values()), 3))
round(p["aa"], 3)
```
### Step 6 · What "rank 1 among 45" means
Sort the 45 candidates from most to least likely. The true writer's place in that list is his **rank**. **Rank 1** means the attacker's top pick is right: the writer is **caught**. Rank 2 means he was its second pick.
If the attacker only guessed, any writer would be rank 1 with chance **1 in 45** (2.2%). Rank 1 is bad for a writer who wants to hide. A high number, like rank 40, is good.

**What you'll see:** the 45 candidates for one held-out text, best guess on the left. The true writer is the dark bar.
```python
who = "aa"                                  # a volunteer, to practise reading the chart
scores = a1.scores(test[who])               # the attacker's probabilities for the held-out text
print("by pure luck:", f"1 in 45 = {1/45:.1%}", "| the attacker's rank for", who, "=", R.rank_of(scores, who))
H.show_plot(R.rank_bars(scores, who, R.INK, "Who does the attacker think wrote this text?", name="Writer " + who))
```
### Step 7 · The baseline: attack all 45 writers with no defense
Now we run the attack on every writer's held-out text, with nobody hiding. Each square below is one writer. A dark square means the attacker named him first.
Three numbers describe the result: how many are caught at **rank 1**, how many are **within the top 5**, and the **median rank** (the middle one of the 45).

**What you'll see:** 21 of the 45 are caught. By luck it would be about 1.

> This is our baseline. Every disguise below is measured against it.
```python
ranks_none = R.ranks_of(a1, test)           # rank of the true writer for each of the 45 held-out texts
H.show_table(["", "caught at rank 1", "within top 5", "median rank"],
             [["no defense", *R.summary(ranks_none)], ["pure luck", "1/45 (2%)", "5/45 (11%)", "23"]],
             "The attack on 45 writers who do nothing to hide")
H.show_plot(R.waffle(ranks_none, R.INK, "How many writers does the attacker catch with no defense?"))
```
### Step 8 · Choose John Doe by a fair rule
John Doe must be one of the writers the attacker catches, or there would be nothing to defend. To avoid cherry-picking, we use a rule: take the caught writers, sort them by the probability the attacker gave them, and pick the **middle** one.
He is an ordinary exposed writer, not the easiest and not the hardest. His square gets a black frame.

**What you'll see:** John Doe's id, and the waffle with his square marked.
```python
doe_id, caught = R.pick_john_doe(a1, test)  # the middle one of the 21 caught writers, by probability
review = test[doe_id]                       # his held-out text plays the anonymous review
print(f"John Doe = candidate {doe_id!r}; the attacker gives him probability {dict(caught)[doe_id]:.2f}")
H.show_plot(R.waffle(ranks_none, R.GREY, "John Doe is one of the caught writers", doe=doe_id))
```
### Step 9 · Compare John Doe's review with his own habits
This is the review that must stay anonymous. The attacker holds John Doe's earlier writing and compares. In each row below, the **diamond** is John Doe's habit in his earlier writing, the **star** is the same word in the review, and the grey dots are the other 44 writers.
When the star sits near the diamond and away from the crowd, the review gives him away.

**What you'll see:** the start of the review, then his habits on four small words.
**Try it:** change the words.
```python
print(f"John Doe's review has {len(review.split())} words:\n")
print(review.strip()[:450], "...")

WORDS = ["the", "that", "to", "and"]                       # try other small words
known = {a: R.rates(train[a], WORDS) for a in authors}     # every writer's habit from earlier writing
H.show_plot(R.strip_plot(known, R.rates([review], WORDS), doe_id, WORDS, "John Doe's review vs his own habits"))
```
### Step 10 · How exposed is John Doe? Can the attacker find him?
Now the attacker reads the review and ranks all 45 candidates. The dark bar is John Doe.
If his bar is the tallest, the attacker names him first, and he is exposed.

**What you'll see:** a table of the attacker's top picks and the bar chart of all 45 candidates.
```python
scores = a1.scores(review)                  # probability for each of the 45 candidates
ranked = sorted(scores, key=scores.get, reverse=True)       # best guess first
rows = [[i + 1, c, f"{scores[c]:.3f}", "<-- John Doe" if c == doe_id else ""] for i, c in enumerate(ranked[:5])]
H.show_table(["rank", "candidate", "probability", ""], rows, "The attacker's top 5 for John Doe's review")
H.show_plot(R.rank_bars(scores, doe_id, R.INK, "Can the attacker find John Doe? (no defense)"))
```
### Step 11 · Your two goals: hide him and keep what he said
A disguise has to do **two things at once**: (1) push John Doe down the attacker's list, and (2) leave the meaning of the review as it was. Hiding alone is easy: hand in a different text.
To see why that fails, we swap in a held-out text by another candidate. The attacker is fooled. But the new text says nothing John Doe meant.
We also count the **words kept**: the share of John Doe's words that are still in the new text. If few survive, the meaning is gone.

**What you'll see:** John Doe's rank for the swapped text, and how few of his words it keeps.
```python
other = authors[0]                          # a different volunteer, to show the trick
fake = test[other]                          # hand in HIS text instead of John Doe's review
s = a1.scores(fake)
print("John Doe's rank for the swapped text:", R.rank_of(s, doe_id), "of 45   (before: 1)")
print(f"words of John Doe's review kept: {R.words_kept(review, fake):.0%}")
print("It hides him, but it no longer says what he said. That is a failed disguise.")
```
### Step 12 · Disguise 1: write differently, by hand
The first disguise is human. Every EBG volunteer also wrote an **obfuscation**: a text where they tried to hide their own style.
They show how well people hide when they sit down and try.
Each line below is one writer: the left end is their rank with no disguise, the **blue** end is their rank after hiding by hand. John Doe's line is the thick one. A line that goes **down** the chart means the writer is harder to find.

**What you'll see:** the human obfuscation table and the slope chart.
```python
ranks_obf = R.ranks_of(a1, obf)             # rank of the true writer for each hand-written disguise
H.show_table(["", "caught at rank 1", "within top 5", "median rank", "John Doe's rank"],
             [["no disguise", *R.summary(ranks_none), ranks_none[doe_id]],
              ["write differently, by hand", *R.summary(ranks_obf), ranks_obf[doe_id]]],
             "Hiding by hand: 45 writers, one new essay each")
H.show_plot(R.slope(ranks_none, ranks_obf, R.BLUE, "Can the attacker still find John Doe? Writing differently by hand", doe=doe_id, after_label="wrote differently by hand"))
```
### Step 13 · Disguise 2: a language model rewrites the review
Most people will not rewrite by hand, so John Doe asks a language model. A **strategy** is the instruction we give the model, such as "write it differently" or "use simple English". Four strategies are ready:

- **write differently** (blue): hide the author's style;
- **translation round trip** (teal): English to Chinese and back to English;
- **simple English** (purple): plain Special English;
- **McCarthy style** (orange): write like the novelist Cormac McCarthy.

Pick a strategy and a model in the menus above (the exact instruction is shown), then run the box. The rewrite is a real one, made earlier by one of four open models, so you need no account.
The word diff shows what changed: red = removed, green = added.

**What you'll see:** John Doe's rank before and after, the share of words kept, and the diff. Does the rewrite still say what he meant?
```python
# strategy_id and cache_config are set by the menus above.
import json
from js import ask_llm                      # helper in app.js: reads the ready-made rewrites

reply = json.loads(await ask_llm("ch4", doe_id, strategy_id, review, cache_config))
if "error" in reply:
    raise RuntimeError(reply["error"])
rewrite = reply["text"]
print("Rewrite source:", reply["source"], "\n")

before, after = a1.scores(review), a1.scores(rewrite)
H.show_table(["text", "P(John Doe)", "his rank of 45", "attacker's top guess"],
             [["original review", f"{before[doe_id]:.2f}", R.rank_of(before, doe_id), R.top_guess(before)],
              ["rewrite", f"{after[doe_id]:.2f}", R.rank_of(after, doe_id), R.top_guess(after)]])
print(f"words of the review kept: {R.words_kept(review, rewrite):.0%}  |  ", H.diff_stats(review, rewrite))
H.show_plot(R.rank_bars(after, doe_id, R.COLOR[strategy_id], "Can the attacker still find John Doe? After this rewrite"))
H.show_html(H.word_diff_html(review, rewrite))           # red = removed, green = added
```
### Step 14 · Score every ready-made rewrite
One rewrite is one story. To judge a strategy we need all 45 writers. The ready-made set has rewrites of **all 45** held-out texts, for the 4 strategies, by 4 small open models: 4 x 4 x 45 = 720 rewrites.
This box runs the attacker on all of them and counts the writers it still catches at rank 1. For each strategy, "all four models" pools 4 x 45 = 180 rewrites.

**What you'll see:** a table, one row per strategy. It takes a few seconds.
```python
from js import cache_all, cache_configs

cfgs = json.loads(await cache_configs("ch4"))              # the 4 models that made the rewrites
llm, ranks_llm, kept_llm = {}, {}, {}
for c in cfgs:
    cached = json.loads(await cache_all("ch4", c))         # all ready-made rewrites of one model
    for s, _ in R.STRATEGIES:
        llm[(s, c)] = {a: cached[f"{a}|{s}"] for a in authors}                          # one rewrite per writer
        ranks_llm[(s, c)] = R.ranks_of(a1, llm[(s, c)])                                 # rank of the true writer
        kept_llm[(s, c)] = {a: R.words_kept(test[a], t) for a, t in llm[(s, c)].items()}   # share of words kept

short = {c: cfgs[c]["model"].split("/")[-1] for c in cfgs}
rows = []
for s, label in R.STRATEGIES:
    caught = [sum(v == 1 for v in ranks_llm[(s, c)].values()) for c in cfgs]
    rows.append([label, *[f"{k}/45" for k in caught], f"{sum(caught)}/180"])
H.show_table(["strategy", *short.values(), "all four models"], rows, "Writers still caught at rank 1 (no defense: 21/45)")
```
### Step 15 · Strategy 1 (blue): write differently
The model is told to rewrite the text so that the author's style is hidden. The chart groups the 45 writers by rank: dark is no defense, blue is this strategy (all four models, scaled to 45 writers).
A good strategy moves writers **to the right**, into the high ranks.

**What you'll see:** the bars, and John Doe's rank after each of the four models.
**Try it:** change `S` to `"backtranslation"`, `"simplification"` or `"imitation"`.
```python
S = "obfuscation"                          # the strategy: write differently
after = R.pooled([ranks_llm[(S, c)] for c in cfgs])        # 4 models x 45 writers
print("John Doe's rank after each model's rewrite:", [ranks_llm[(S, c)][doe_id] for c in cfgs])
print("words of his review kept:", [f"{kept_llm[(S, c)][doe_id]:.0%}" for c in cfgs])
H.show_plot(R.bucket_bars(ranks_none, after, R.COLOR[S], R.LABEL[S], "Can the attacker still find the writers? Write differently"))
```
### Step 16 · Strategy 2 (teal): a translation round trip
The text goes to Chinese and comes back to English. The meaning mostly survives, because the translator tries to keep it. But does the style leave?

**What you'll see:** the same chart for the round trip, and John Doe's rank after each model.
```python
S = "backtranslation"                      # the strategy: English -> Chinese -> English
after = R.pooled([ranks_llm[(S, c)] for c in cfgs])
print("John Doe's rank after each model's rewrite:", [ranks_llm[(S, c)][doe_id] for c in cfgs])
print("words of his review kept:", [f"{kept_llm[(S, c)][doe_id]:.0%}" for c in cfgs])
H.show_plot(R.bucket_bars(ranks_none, after, R.COLOR[S], R.LABEL[S], "Can the attacker still find the writers? Translation round trip"))
```
### Step 17 · Strategy 3 (purple): simple English
The model is told to rewrite the text in plain, short Special English. Short common words replace long rare ones, and sentences get simpler. That changes the small words a lot.

**What you'll see:** the same chart for simple English. Compare how many writers land in "rank 16-45".
```python
S = "simplification"                       # the strategy: simple English
after = R.pooled([ranks_llm[(S, c)] for c in cfgs])
print("John Doe's rank after each model's rewrite:", [ranks_llm[(S, c)][doe_id] for c in cfgs])
print("words of his review kept:", [f"{kept_llm[(S, c)][doe_id]:.0%}" for c in cfgs])
H.show_plot(R.bucket_bars(ranks_none, after, R.COLOR[S], R.LABEL[S], "Can the attacker still find the writers? Simple English"))
```
### Step 18 · Strategy 4 (orange): a McCarthy-style rewrite
The model is told to rewrite the text in the style of the novelist Cormac McCarthy: short, blunt sentences with few commas. It is a style disguise, not a person you are pretending to be.

**What you'll see:** the same chart for the McCarthy-style rewrite.
```python
S = "imitation"                            # the strategy: McCarthy style
after = R.pooled([ranks_llm[(S, c)] for c in cfgs])
print("John Doe's rank after each model's rewrite:", [ranks_llm[(S, c)][doe_id] for c in cfgs])
print("words of his review kept:", [f"{kept_llm[(S, c)][doe_id]:.0%}" for c in cfgs])
H.show_plot(R.bucket_bars(ranks_none, after, R.COLOR[S], R.LABEL[S], "Can the attacker still find the writers? McCarthy style"))
```
### Step 19 · All disguises side by side
Now every disguise on one chart. Each bar is the number of writers (out of 45) the attacker still names first. **Shorter is better for John Doe.** The black dots are the four single models; the hollow circle marks how many writers are still in the attacker's top 5.
The dashed line is pure luck: about 1 writer.

**What you'll see:** no disguise at 21; every strategy lower; and hiding by hand lowest of all.
```python
rows = R.compare_rows(ranks_none, ranks_obf, ranks_llm, cfgs)     # one row per disguise
H.show_table(["disguise", "still caught at rank 1 (per 45)", "within top 5 (per 45)"],
             [[r[1], f"{r[2]:.0f}", f"{r[3]:.0f}"] for r in rows], "Writers the attacker still finds")
H.show_plot(R.strategy_compare(rows, "Can the attacker still find the writers? Every disguise"))
```
### Step 20 · The price of hiding: how much of John Doe's text survives
A rewrite that changes more words hides more, but it also risks losing what John Doe said. Each dot below is one rewrite (720 in all). Left to right is **how many of his words survive**; top to bottom is the **attacker's rank** of the true writer (the lower down, the better hidden). The big dots are the medians.
A rewrite that keeps almost none of his words cannot say what he said.

**What you'll see:** where each strategy sits: how many words it keeps, and how well it hides.
```python
points = R.tradeoff_points(kept_llm, ranks_llm, cfgs)     # (words kept, rank) for every rewrite
rows = [[R.LABEL[s], f"{100 * np.median([p[0] for p in pts]):.0f}%", f"{np.median([p[1] for p in pts]):g}"] for s, pts in points.items()]
H.show_table(["strategy", "median words kept", "median rank"], rows, "The price of hiding")
H.show_plot(R.tradeoff_plot(points))
```
### Step 21 · Where does John Doe himself end up?
Averages hide the one case we care about. Here is **John Doe's own rank** after each of the 16 rewrites of his review (4 strategies x 4 models), with the share of his words kept. A strong colour means he is well hidden.
Then we read the best-hidden rewrite and ask the question that matters: does it still say what he said?

**What you'll see:** the grid, and the best rewrite with its word diff.
```python
table = R.doe_table(doe_id, kept_llm, ranks_llm, cfgs)
H.show_plot(R.doe_grid(table))

best = max(llm, key=lambda k: ranks_llm[k][doe_id])        # the rewrite that hides him best
s, c = best
print(f"The best-hidden rewrite: {R.LABEL[s]} by {short[c]}; John Doe's rank {ranks_llm[best][doe_id]}, words kept {kept_llm[best][doe_id]:.0%}")
H.show_html(H.word_diff_html(review, llm[best][doe_id]))
```
### Step 22 · Your turn: write John Doe's disguise
Now you are the defender. Copy John Doe's review from the box below, rewrite it **by hand or with any chatbot**, paste your version into the text area, and run the box. The page ranks it with the same attacker.
Run it first with the text area empty to see the original.

> **Do not paste personal or confidential text into an online chatbot.** John Doe's review is a public research text, so it is fine to use here; your own writing may not be.

**You win** if John Doe's rank goes **up** (towards 45) **and** your text still says what he said. What the earlier steps suggest: change the small words, such as *the*, *that*, *to* and *and*, and the way sentences are built. Simple English moved him furthest. Try one change at a time and see what moves the rank.

**What you'll see:** the attacker's ranking of the 45 candidates, before and after, John Doe's rank, and the share of his words you kept.
```python
# my_text is whatever you pasted into the text area above (empty = just show the original).
import html
my = my_text.strip()
box = html.escape(review.strip())
H.show_html('<p><strong>John Doe\'s original review</strong> (copy it, rewrite it, paste your version above):</p>'
            '<textarea readonly rows="9" class="copybox" aria-label="John Doe\'s original review">' + box + '</textarea>'
            '<p><button type="button" class="btn small" onclick="var t=this.parentNode.previousElementSibling;t.select();'
            'try{navigator.clipboard.writeText(t.value)}catch(e){document.execCommand(\'copy\')}">Copy the review</button></p>')

before = a1.scores(review)
if not my:
    print("Nothing pasted yet: paste your rewrite into the text area above and run this box again.")
    H.show_plot(R.rank_bars(before, doe_id, R.INK, "Can the attacker find John Doe? (the original review)"))
else:
    after = a1.scores(my)
    kept = R.words_kept(review, my)
    H.show_table(["text", "P(John Doe)", "his rank of 45", "attacker's top guess"],
                 [["original review", f"{before[doe_id]:.2f}", R.rank_of(before, doe_id), R.top_guess(before)],
                  ["your rewrite", f"{after[doe_id]:.2f}", R.rank_of(after, doe_id), R.top_guess(after)]])
    print(f"John Doe's rank: {R.rank_of(before, doe_id)} -> {R.rank_of(after, doe_id)} | words of the review kept: {kept:.0%}")
    H.show_plot(R.own_plot(before, after, doe_id, kept))
    H.show_html(H.word_diff_html(review, my))
```
### You just defended John Doe with a machine-learning project
- **Features:** you turned texts into numbers (224 small-word counts).
- **Training:** you built the attacker, a logistic regression that ranks 45 candidates for any text.
- **Baseline:** with no defense it names the right writer first for 21 of 45 (luck would give about 1), and John Doe was one of them.
- **Disguises:** writing differently by hand left 2 of 45 caught. Rewrites by models left 34% caught after a translation round trip, 24% after "write differently", 16% after a McCarthy-style rewrite and 13% after simple English.
- **The price:** hiding more costs words, and words are the meaning. A winning disguise hides John Doe **and** still says what he said.
- **Your disguise:** you tested your own rewrite against the same attacker.

Stuck on a step, or curious why? Ask **B'lawd**, bottom right.
Credits: Data: the Extended Brennan-Greenstadt (EBG) corpus from the PSAL Anonymouth repository (https://github.com/psal/anonymouth, jsan_resources/corpora/amt; Copyright 2011-2013 Privacy, Security and Automation lab, Drexel University; AGPL-3.0). The files are copied unchanged into this lab's data/ch4/ebg/ folder, with the licence and notice; the page checks every file's SHA-256 against the pinned commit.
LLM rewrites: Wang (2026) local-LLM benchmark, retained outputs; they are machine rewrites of EBG texts, so they are shared under the same AGPL-3.0 terms. Strategy prompts: the same benchmark. Function-word list: derived for this lab (the 224-word list FW in unabom/scripts/verify.py, also used in Case 2). The case: Glassdoor, Inc. v. Superior Court (Machine Zone, Inc.), 9 Cal. App. 5th 623 (2017). Everything about stylometry here is hypothetical.

---

## Helper module lab_helpers.py (imported by the lab cells)
```python
"""Small helpers for the stylometry lab (runs inside Pyodide, also used by tools/build_data.py).

Everything here is plain Python so the lab cells can stay short.
Heavier helpers (plots, diffs) import numpy / matplotlib only when called.
"""
import re
import json
import unicodedata
import difflib
import base64
import io
from collections import Counter

# ---------------------------------------------------------------- text basics
_QUOTES = {"‘": "'", "’": "'", "“": '"', "”": '"', "—": "-", "–": "-"}


def fold(text):
    """Lower-case, straighten quotes, drop accents (Tzŭ -> tzu)."""
    for a, b in _QUOTES.items():
        text = text.replace(a, b)
    text = unicodedata.normalize("NFKD", text)
    text = "".join(ch for ch in text if not unicodedata.combining(ch))
    return text.lower()


def tokens(text):
    """Split a text into lower-case words (letters only)."""
    return re.findall(r"[a-z]+", fold(text))


def count_function_words(text, words):
    """Return a list of counts, one per function word, in the order of `words`."""
    c = Counter(tokens(text))
    return [c[w] for w in words]


def load_fw224(path="data/function_words_224.json"):
    """The lab's 224 function words (the list FW in unabom/scripts/verify.py, also used in Chapter 2)."""
    with open(path, encoding="utf-8") as f:
        return json.load(f)["words"]


_FW_TOKEN = re.compile(r"[a-z]+(?:'[a-z]+)?")


def fw_tokens(text):
    """Lower-case words (letters and inner apostrophes; curly apostrophes straightened): the tokenizer of Chapter 2."""
    return _FW_TOKEN.findall(text.lower().replace("\u2019", "'"))


def fw_counts(text, words):
    """Counts of each word in `words` among the tokens of `text` (see fw_tokens), in the order of `words`."""
    c = Counter(fw_tokens(text))
    return [c[w] for w in words]


def relative_freq(counts, n_words):
    """Counts -> share of all words (e.g. 0.035 = 3.5 %)."""
    return [x / max(n_words, 1) for x in counts]


# --------------------------------------------------- character 3-gram features
def cg_normalize(text):
    """Keep letters, digits, spaces and basic punctuation; collapse white space."""
    t = re.sub(r"[^a-z0-9 .,;:!?\"'()-]", " ", fold(text))
    return re.sub(r"\s+", " ", t).strip()


def cg_counts(text, vocab_index):
    """Count character 3-grams that are in the lab's fixed vocabulary.

    vocab_index: dict {trigram: column number}. Returns {column: count}.
    """
    t = cg_normalize(text)
    c = Counter(t[i:i + 3] for i in range(len(t) - 2))
    return {vocab_index[g]: n for g, n in c.items() if g in vocab_index}


def cg_matrix(rows, n_cols):
    """List of {column: count} dicts -> dense numpy matrix; each row is scaled to length 1 (L2)."""
    import numpy as np
    M = np.zeros((len(rows), n_cols))
    for i, r in enumerate(rows):
        for j, n in r.items():
            M[i, int(j)] = n
    return M / np.maximum(np.sqrt((M ** 2).sum(axis=1, keepdims=True)), 1e-9)


# ------------------------------------------------------------------ word diff
def word_diff_html(before, after):
    """HTML with deleted words in red/struck-through and added words in green."""
    a, b = before.split(), after.split()
    out = []
    esc = lambda s: s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
        if op == "equal":
            out.append(esc(" ".join(a[i1:i2])))
        else:
            if i2 > i1:
                out.append('<del>%s</del>' % esc(" ".join(a[i1:i2])))
            if j2 > j1:
                out.append('<ins>%s</ins>' % esc(" ".join(b[j1:j2])))
    return '<div class="diff">%s</div>' % " ".join(out)


def diff_stats(before, after):
    a, b = before.split(), after.split()
    r = difflib.SequenceMatcher(None, a, b, autojunk=False).ratio()
    return "%.0f%% of the words are unchanged (%d words before, %d after)" % (100 * r, len(a), len(b))


# ------------------------------------------------------- output to the page
def show_html(html):
    """Send an HTML snippet (e.g. a table) to the output area of the running cell."""
    print("<<<LAB:HTML>>>" + html.replace("\n", " ") + "<<<LAB:END>>>")


def show_table(header, rows, caption=None):
    esc = lambda s: str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    h = "".join("<th>%s</th>" % esc(c) for c in header)
    body = "".join("<tr>%s</tr>" % "".join("<td>%s</td>" % esc(c) for c in r) for r in rows)
    cap = "<caption>%s</caption>" % esc(caption) if caption else ""
    show_html('<table class="data">%s<thead><tr>%s</tr></thead><tbody>%s</tbody></table>' % (cap, h, body))


def show_plot(fig):
    """Render a matplotlib figure as PNG and send it to the output area."""
    buf = io.BytesIO()
    fig.savefig(buf, format="png", dpi=110, bbox_inches="tight")
    import matplotlib.pyplot as plt
    plt.close(fig)
    print("<<<LAB:PNG>>>" + base64.b64encode(buf.getvalue()).decode() + "<<<LAB:END>>>")


def load_json(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def display(value):
    """Show the value of a cell's last line, the way Colab and Jupyter do (figures as plots, containers pretty-printed)."""
    if value is None:
        return
    import sys
    if "matplotlib" in sys.modules:
        import matplotlib.figure
        if isinstance(value, matplotlib.figure.Figure):
            show_plot(value)
            return
    if type(value).__module__ == "numpy" and hasattr(value, "item") and getattr(value, "ndim", 1) == 0:
        value = value.item()                   # show np.float64(0.5) as 0.5
    if isinstance(value, (dict, list, tuple, set)):
        import pprint
        print(pprint.pformat(value, width=100, compact=True, sort_dicts=False))
    else:
        print(repr(value))
```

---

## Helper module lab_ch2.py (imported by the lab cells)
```python
"""Chapter 2 helpers (Unabomber case): the dot strip, and the "Ted or not?" model that scores whole texts.

Same recipe as unabom/scripts/text_level.py. Input is the shipped table of function-word counts per 1,000-word piece; no text is needed.
"""
import json
import numpy as np

BLUE, ORANGE, GREY, INK, TEAL = "#0F5C8C", "#B35F00", "#9E978A", "#1F2430", "#00876A"   # Ted, the manifesto, other writers, text, highlights (lecture palette)
CREAM, MUTED, CRIM = "#F7F5F0", "#6B6458", "#1F2430"                      # page background, quiet text, the alarm line


def load(path="data/ch2/fw_counts.json"):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def counts(block):
    """{'counts': ..., 'n': ...} -> matrix of function-word counts, one row per 1,000-word piece."""
    return np.array(block["counts"], float)


def per_1000(block):
    """Whole-text counts {'n', 'counts'} -> function-word frequencies per 1,000 words."""
    return np.array(block["counts"], float) / block["n"] * 1000


def dot_strip(D, words):
    """One row per word: 19 other writers (grey dots), Ted's 1971 essay (blue diamond), the manifesto (orange star)."""
    import matplotlib
    matplotlib.use("agg")
    import matplotlib.pyplot as plt
    ix = {w: i for i, w in enumerate(D["fw"])}
    T = D["totals"]
    others = np.array([per_1000(b) for b in T["authors"].values()])
    t2, u14 = per_1000(T["t2"]), per_1000(T["u14"])
    fig, axes = plt.subplots(len(words), 1, figsize=(7.5, 1.35 * len(words) + 0.9), squeeze=False)
    rng = np.random.default_rng(1)
    for ax, w in zip(axes[:, 0], words):
        j = ix[w]
        ax.scatter(others[:, j], rng.uniform(-0.18, 0.18, len(others)), s=36, color=GREY, alpha=0.9, zorder=2, label="19 other writers")
        ax.scatter([t2[j]], [0], s=110, marker="D", color=BLUE, zorder=3, label="Ted's 1971 essay")
        ax.scatter([u14[j]], [0], s=190, marker="*", color=ORANGE, zorder=4, label="The manifesto (1995)")
        lo, hi = min(others[:, j].min(), t2[j], u14[j]), max(others[:, j].max(), t2[j], u14[j])
        ax.set_xlim(lo - (hi - lo) * 0.08, hi + (hi - lo) * 0.08); ax.set_ylim(-0.5, 0.5); ax.set_yticks([])
        ax.set_ylabel('"%s"' % w, rotation=0, ha="right", va="center", fontsize=12)
        for sp in ("top", "right", "left"):
            ax.spines[sp].set_visible(False)
    axes[-1, 0].set_xlabel("times per 1,000 words (each row has its own scale)")
    h, lab = axes[0, 0].get_legend_handles_labels()
    fig.legend(h, lab, loc="upper center", ncol=3, frameon=False, fontsize=9)
    fig.tight_layout(rect=(0, 0, 1, 0.93 if len(words) > 2 else 0.88))
    return fig


def make_model():
    """Shares of words -> one scale per word -> logistic regression."""
    from sklearn.pipeline import make_pipeline
    from sklearn.preprocessing import Normalizer, StandardScaler
    from sklearn.linear_model import LogisticRegression
    return make_pipeline(Normalizer(norm="l1"), StandardScaler(), LogisticRegression(C=1.0, max_iter=5000, class_weight="balanced"))


def group_folds(groups, k=5):
    """Split pieces into k folds so that all pieces of one text stay together (same rule as scikit-learn's GroupKFold:
    biggest texts first, each into the lightest fold; written out here so every scikit-learn version gives the same folds)."""
    names, which = np.unique(groups, return_inverse=True)
    size = np.bincount(which)
    load, fold_of = np.zeros(k), np.zeros(len(names), int)
    for g in np.argsort(size, kind="stable")[::-1]:
        fold_of[g] = load.argmin()
        load[fold_of[g]] += size[g]
    return [(np.where(fold_of[which] != f)[0], np.where(fold_of[which] == f)[0]) for f in range(k)]


def train_and_score(D):
    """Train "Ted or not?" on Ted's 1971 essay (1) against the other writers' pieces (0), then score whole texts.
    A text's score = the average log-odds of its 1,000-word pieces.
    Other writers' texts are scored by a model that never saw them (5 folds, split by whole text).
    Returns the three groups of scores and the alarm line (the 95th percentile of the other writers' scores)."""
    T = counts(D["t2"])
    imp = D["impostors"]
    I = np.vstack([counts(r) for r in imp])
    groups = np.array([r["author"] + "/" + r["text"] for r in imp for _ in r["n"]])
    held = np.zeros(len(I))
    for train, test in group_folds(groups):
        m = make_model().fit(np.vstack([T, I[train]]), np.r_[np.ones(len(T)), np.zeros(len(train))])
        held[test] = m.decision_function(I[test])
    texts = sorted(set(groups))
    others = np.array([held[groups == g].mean() for g in texts])
    m = make_model().fit(np.vstack([T, I]), np.r_[np.ones(len(T)), np.zeros(len(I))])
    later = np.array([m.decision_function(counts(r)).mean() for r in D["ted_post"]])
    manifesto = float(m.decision_function(counts(D["u14"])).mean())
    return {"others": others, "later": later, "manifesto": manifesto, "line": float(np.quantile(others, 0.95))}


def score_plot(r):
    """Three rows, one dot per whole text. Everything right of the dashed line is flagged as Ted."""
    import matplotlib
    matplotlib.use("agg")
    import matplotlib.pyplot as plt
    th = r["line"]
    rows = [(r["others"], "Other writers", "texts it never saw", GREY, "o", 45, True),
            (r["later"], "Ted's later essays", "known Ted: a check", BLUE, "D", 90, True),
            (np.array([r["manifesto"]]), "The manifesto", "the question", ORANGE, "*", 330, True)]
    n = len(rows)
    fig = plt.figure(figsize=(9.6, 1.35 * n + 0.9), dpi=100); fig.patch.set_facecolor(CREAM)
    ax = fig.add_axes([0.30, 0.19, 0.46, 0.76]); ax.set_facecolor(CREAM)
    allv = np.concatenate([x[0] for x in rows])
    xmin, xmax = allv.min() - .5, allv.max() + .5
    ax.set_xlim(xmin, xmax); ax.set_ylim(-.55, n - 1 + .85)
    ax.axvspan(th, xmax, color="#ECE7DD", zorder=0); ax.axvline(th, color=CRIM, lw=2.5, ls="--", zorder=1)
    rng = np.random.default_rng(3)
    for (v, lab, role, col, mk, sz, _), yy in zip(rows, range(n - 1, -1, -1)):
        jit = rng.uniform(-.28, .28, len(v)) if len(v) > 1 else np.zeros(1)
        ax.scatter(v, yy + jit, s=sz, color=col, marker=mk, edgecolors="white", linewidths=.8, alpha=.9 if col == GREY else 1, zorder=3)
        ylab = ax.transData.transform((0, yy))[1] / fig.bbox.height
        fig.text(0.285, ylab + .018, lab, ha="right", va="center", fontsize=11.5, fontweight="bold", color=INK)
        fig.text(0.285, ylab - .036, role, ha="right", va="center", fontsize=8.5, color=MUTED)
        k = int((v > th).sum())
        txt = ("flagged" if k else "not flagged") if len(v) == 1 else "%d of %d flagged" % (k, len(v))
        fig.text(0.78, ylab, txt, ha="left", va="center", fontsize=11.5, fontweight="bold", color=MUTED if col == GREY else col)
    ax.text(th + 0.12, n - 1 + .62, "flagged as Ted  →", color=CRIM, fontsize=12, fontweight="bold", va="center")
    ax.set_yticks([]); ax.set_xticks([])
    ax.set_xlabel("Computer's score:   less like Ted  ←            →  more like Ted", fontsize=10, color=INK)
    for k in ("top", "right", "left"):
        ax.spines[k].set_visible(False)
    return fig


# ---- extra pictures for the step-by-step chapter ------------------------------------------------------------------

def _plt():
    import matplotlib
    matplotlib.use("agg")
    import matplotlib.pyplot as plt
    plt.rcParams.update({"font.size": 10.5, "axes.spines.top": False, "axes.spines.right": False,
                         "axes.titleweight": "bold", "axes.titlesize": 12, "axes.titlelocation": "left"})
    return plt


def piece_bars(piece, fw, k=15):
    """The k most used small words in one 1,000-word piece."""
    plt = _plt()
    top = np.argsort(piece)[::-1][:k][::-1]
    fig, ax = plt.subplots(figsize=(7.2, 4.2))
    ax.barh([fw[j] for j in top], piece[top], color=BLUE)
    for i, j in enumerate(top):
        ax.text(piece[j] + 0.6, i, str(int(piece[j])), va="center", fontsize=9, color=MUTED)
    ax.set_xlabel("times in this 1,000-word piece")
    ax.set_title("One piece of Ted's 1971 essay, as the computer sees it")
    return fig


def table_heatmap(X, fw, n_ted, words=("the", "of", "and", "to", "a", "in", "that", "is", "which", "it", "be", "will", "not", "as", "because", "any"), k=6):
    """A corner of the training table: k Ted pieces and k other-writer pieces, a few columns, with the label column y."""
    plt = _plt()
    rows = list(range(k)) + list(range(n_ted, n_ted + k))
    cols = [fw.index(w) for w in words]
    M = X[np.ix_(rows, cols)]
    fig, (ax, ay) = plt.subplots(1, 2, figsize=(9.6, 4.6), gridspec_kw={"width_ratios": [len(cols), 1.4], "wspace": 0.05})
    ax.imshow(M, cmap="Blues", aspect="auto")
    for i in range(M.shape[0]):
        for j in range(M.shape[1]):
            ax.text(j, i, int(M[i, j]), ha="center", va="center", fontsize=8, color="white" if M[i, j] > M.max() * 0.55 else INK)
    ax.set_xticks(range(len(cols))); ax.set_xticklabels(words, rotation=55, ha="right")
    ax.set_yticks(range(len(rows))); ax.set_yticklabels([f"Ted 1971 · piece {i + 1}" for i in range(k)] + [f"other writer · piece {i + 1}" for i in range(k)], fontsize=9)
    ax.axhline(k - 0.5, color=INK, lw=1.5)
    ax.set_title("X: one row per piece, one column per small word (16 of 224 shown)")
    ay.imshow(np.r_[np.ones(k), np.zeros(k)][:, None], cmap=matplotlib_cmap(), aspect="auto", vmin=0, vmax=1)
    for i in range(2 * k):
        ay.text(0, i, "1" if i < k else "0", ha="center", va="center", fontsize=10, fontweight="bold", color="white" if i < k else INK)
    ay.set_xticks([0]); ay.set_xticklabels(["y"], fontweight="bold"); ay.set_yticks([])
    for sp in ay.spines.values():
        sp.set_visible(False)
    return fig


def matplotlib_cmap():
    from matplotlib.colors import ListedColormap
    return ListedColormap(["#ECE7DD", BLUE])


def scale_hist(shares, scaled, fw, words=("the", "because")):
    """Before and after rescaling: each word's values across all pieces."""
    plt = _plt()
    fig, axes = plt.subplots(2, len(words), figsize=(9.6, 5.2))
    for c, w in enumerate(words):
        j = fw.index(w)
        axes[0, c].hist(shares[:, j], bins=30, color=GREY)
        axes[0, c].set_title(f'"{w}" as a share of all small words')
        axes[1, c].hist(scaled[:, j], bins=30, color=TEAL)
        axes[1, c].axvline(0, color=INK, lw=1.2, ls="--")
        axes[1, c].set_title(f'"{w}" after rescaling: 0 = usual')
        axes[1, c].set_xlim(-4, 4)
    for ax in axes.ravel():
        ax.set_yticks([])
    axes[1, 0].set_xlabel("below usual  ←   0   →  above usual"); axes[1, 1].set_xlabel("below usual  ←   0   →  above usual")
    fig.tight_layout()
    return fig


def pca_map(X, T, U, n_ted):
    """Every piece as one dot on a 2-D map of all 224 small words (PCA). Grey: other writers; blue: Ted 1971; orange: the manifesto."""
    from sklearn.pipeline import make_pipeline
    from sklearn.preprocessing import Normalizer, StandardScaler
    from sklearn.decomposition import PCA
    plt = _plt()
    pre = make_pipeline(Normalizer(norm="l1"), StandardScaler()).fit(X)
    pca = PCA(2).fit(pre.transform(X))
    Zi, Zt, Zu = (pca.transform(pre.transform(M)) for M in (X[n_ted:], T, U))
    fig, ax = plt.subplots(figsize=(7.6, 5.6))
    ax.scatter(Zi[:, 0], Zi[:, 1], s=22, color=GREY, alpha=0.6, label="other writers (282 pieces)")
    ax.scatter(Zu[:, 0], Zu[:, 1], s=110, marker="*", color=ORANGE, edgecolors="white", linewidths=0.5, label="the manifesto (30 pieces)")
    ax.scatter(Zt[:, 0], Zt[:, 1], s=70, marker="D", color=BLUE, edgecolors="white", linewidths=0.6, label="Ted's 1971 essay (6 pieces)")
    ax.set_xlabel("map direction 1"); ax.set_ylabel("map direction 2"); ax.set_xticks([]); ax.set_yticks([])
    ax.set_title("All 224 small words, squeezed onto one map")
    ax.legend(frameon=False, loc="lower right", fontsize=9)
    return fig


def weight_bars(w, fw, k=12):
    """The k strongest words on each side of the model."""
    plt = _plt()
    order = np.argsort(w)
    idx = list(order[:k]) + list(order[-k:])
    fig, ax = plt.subplots(figsize=(7.6, 6.4))
    vals = w[idx]
    ax.barh(range(len(idx)), vals, color=[BLUE if v > 0 else GREY for v in vals])
    ax.set_yticks(range(len(idx))); ax.set_yticklabels([fw[j] for j in idx])
    ax.axvline(0, color=INK, lw=1)
    ax.set_xlabel("weight:   ← says \"not Ted\"        says \"Ted\" →")
    ax.set_title("What the model learned: the strongest small words")
    return fig


def contributions(model, row, fw, k=8):
    """How one piece's score is added up: weight x (rescaled) value for each word; the biggest pushes either way."""
    plt = _plt()
    z = model[:-1].transform(row[None, :])[0]
    w = model[-1].coef_[0]
    c = w * z
    order = np.argsort(c)
    idx = list(order[:k]) + list(order[-k:])
    fig, ax = plt.subplots(figsize=(7.6, 5.4))
    ax.barh(range(len(idx)), c[idx], color=[BLUE if v > 0 else GREY for v in c[idx]])
    ax.set_yticks(range(len(idx))); ax.set_yticklabels([fw[j] for j in idx])
    ax.axvline(0, color=INK, lw=1)
    ax.set_xlabel("push on the score:   ← less like Ted      more like Ted →")
    ax.set_title("Inside one score: which words pushed it up or down")
    return fig, float(c.sum() + model[-1].intercept_[0])


def alarm_hist(others, line):
    """The other writers' whole-text scores (from models that never saw them), with the alarm line."""
    plt = _plt()
    fig, ax = plt.subplots(figsize=(8.0, 3.6))
    ax.hist(others, bins=14, color=GREY, edgecolor="white")
    ax.axvline(line, color=INK, lw=2.2, ls="--")
    ax.text(line + 0.1, ax.get_ylim()[1] * 0.92, "alarm line", fontweight="bold", color=INK)
    ax.set_xlabel("score of a whole text:   less like Ted ←   → more like Ted"); ax.set_ylabel("number of texts")
    ax.set_title("29 texts by other writers, each scored by a model that never saw it")
    return fig


def similarity_rank(D, X, n_ted):
    """Who writes most like the manifesto? Each writer's average profile (shares, rescaled) against the manifesto's
    (cosine similarity). Returns the figure and the ranking [(name, similarity), ...], most alike first."""
    from sklearn.pipeline import make_pipeline
    from sklearn.preprocessing import Normalizer, StandardScaler
    plt = _plt()
    pre = make_pipeline(Normalizer(norm="l1"), StandardScaler()).fit(X)
    u = pre.transform(counts(D["u14"])).mean(0)
    cos = lambda a: float(a @ u / np.linalg.norm(a) / np.linalg.norm(u))
    by = {}
    for r in D["impostors"]:
        by.setdefault(r["name"], []).append(counts(r))
    rank = [("Ted Kaczynski (1971 essay)", cos(pre.transform(X[:n_ted]).mean(0)))]
    rank += [(name, cos(pre.transform(np.vstack(rows)).mean(0))) for name, rows in by.items()]
    rank.sort(key=lambda t: -t[1])
    fig, ax = plt.subplots(figsize=(8.2, 6.4))
    names, vals = [n for n, _ in rank][::-1], [v for _, v in rank][::-1]
    ted = [n.startswith("Ted") for n in names]
    ax.barh(range(len(vals)), vals, color=[BLUE if t else GREY for t in ted], height=0.72)
    ax.set_yticks(range(len(vals))); ax.set_yticklabels(names)
    for lab, t in zip(ax.get_yticklabels(), ted):
        if t: lab.set_color(BLUE); lab.set_fontweight("bold")
    ax.axvline(0, color=INK, lw=1)
    ax.set_xticks([])
    ax.set_xlabel("←  less like the manifesto            more like the manifesto  →")
    ax.set_title("Who writes most like the manifesto?")
    ax.spines["left"].set_visible(False)
    return fig, rank
```

---

## Helper module lab_ch3.py (imported by the lab cells)
```python
"""Chapter 3 helpers (Lu Xun or Zhou Zuoren?): count 31 Chinese function characters, highlight them, and draw the plots.

Counting ported from the_many_voices/utils.py and run.py (Xie, Li and Wang, DSH 2024, 0BSD licence).
Plots need a Chinese font, which the browser's Python does not have: data/ch3/font.json holds a small subset of Noto Sans SC
(SIL Open Font License 1.1, see data/ch3/FONT_LICENSE.txt) and every plot function loads it first.
"""
import re

BLUE, ORANGE, TEAL, GREY, INK = "#0F5C8C", "#B35F00", "#00876A", "#9E978A", "#1F2430"      # Zhou Zuoren, Lu Xun, highlight, other, text
MUTED, CREAM = "#6B6458", "#F7F5F0"                                                         # quiet text, page background

# 27 single characters and 4 two-character words chosen by recursive feature elimination in the paper.
GRAMS = ['诚', '于', '乃', '光', '原', '各', '必', '惟', '不', '随', '本',
         '全', '但', '徒', '别', '是', '为', '何', '多', '夫', '则', '之',
         '焉', '皆', '而', '矣', '及', '自然', '进而', '足以', '于是']

# Rough English meanings, for readers who do not know classical Chinese (one or two words each).
GLOSS = {'诚': 'truly', '于': 'in, at', '乃': 'then', '光': 'light', '原': 'originally', '各': 'each', '必': 'must', '惟': 'only',
         '不': 'not', '随': 'follow', '本': 'root, this', '全': 'wholly', '但': 'only, but', '徒': 'merely', '别': 'other',
         '是': 'this', '为': 'be, for', '何': 'what', '多': 'many', '夫': 'as for', '则': 'so, then', '之': 'of',
         '焉': 'there', '皆': 'all', '而': 'and, yet', '矣': '(ends a clause)', '及': 'and, reach', '自然': 'naturally',
         '进而': 'furthermore', '足以': 'enough to', '于是': 'thereupon'}


def label(g):
    """A character with its English meaning, for axes: '之  of'."""
    return "%s  %s" % (g, GLOSS[g])


# ------------------------------------------------------------------ counting
def length(text):
    """Length in characters, ignoring white space and masked quotations such as [MASK]."""
    return len(re.sub(r"\s+", "", re.sub(r"\[([A-Za-z ]+)\]", "", text)))


def count_frequency(grams, doc):
    """How often each gram occurs. A short gram is not counted again inside a longer gram on the list:
    the 是 inside 于是 counts once, as 于是, not also as 是."""
    raw = {g: len(re.findall(g, doc)) for g in grams}
    out = {}
    max_n = max(len(g) for g in grams)
    for n in range(max_n, 0, -1):                      # longest grams first
        longer = {g: c for g, c in out.items() if len(g) > n}
        for g in [g for g in grams if len(g) == n]:
            deduct = 0
            for lg, c in longer.items():
                if g in lg:
                    deduct += c * len(re.findall(g, lg))
            out[g] = raw[g] - deduct
    return [out[g] for g in grams]


def features(texts, grams=GRAMS):
    """Rows = texts; columns = how often each gram occurs per character of text."""
    return [[c / length(t) for c in count_frequency(grams, t)] for t in texts]


def rates_per_1000(text, grams=GRAMS):
    """How often each gram occurs per 1,000 characters of the text."""
    return [c / length(text) * 1000 for c in count_frequency(grams, text)]


def most_telling(X, y, k=2):
    """The k columns whose averages differ most between the two brothers, measured against how much the pieces vary
    (gap divided by spread). y = 1 for Lu Xun, 0 for Zhou Zuoren."""
    import numpy as np
    X, y = np.array(X, float), np.array(y)
    a, b = X[y == 1], X[y == 0]
    spread = np.sqrt((a.var(axis=0) + b.var(axis=0)) / 2) + 1e-12
    return [int(i) for i in np.argsort(-np.abs(a.mean(axis=0) - b.mean(axis=0)) / spread)[:k]]


# ------------------------------------------------------------------ HTML for the page
_esc = lambda s: s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def passage_html(who, text, color):
    """A block of Chinese text with the writer's name above it in his colour."""
    return ('<div class="hl" style="border-left:5px solid %s"><p style="margin:0 0 4px;font-size:.8rem;font-weight:600;color:%s">%s</p><p>%s</p></div>'
            % (color, color, _esc(who), _esc(text).replace("\n", "</p><p>")))


def gloss_html(text):
    """The English translation, as a quiet block under the Chinese."""
    return '<div class="gloss">%s</div>' % _esc(text).replace("\n", "<br>")


def legend_html(weighted=True):
    """Colour key for highlight_html."""
    if weighted:
        return ('<p class="legend"><span style="background:rgba(179,95,0,.55)">favours Lu Xun</span> '
                '<span style="background:rgba(15,92,140,.5)">favours Zhou Zuoren</span> (darker = a bigger weight)</p>')
    return '<p class="legend"><span style="background:rgba(0,135,106,.3)">function character</span></p>'


def highlight_html(text, grams, weights=None):
    """The text with every feature marked. Without weights: all the same teal. With weights: orange favours Lu Xun
    (weight > 0), blue favours Zhou Zuoren (weight < 0); the darker the shade, the larger the weight. Hover for the English meaning."""
    w = dict(zip(grams, weights)) if weights is not None else None
    top = max(abs(x) for x in weights) if weights is not None else 1
    pattern = re.compile("|".join(re.escape(g) for g in sorted(grams, key=lambda g: -len(g))))

    def mark(m):
        g = m.group(0)
        tip = GLOSS.get(g, "")
        if w is None:
            return '<mark title="%s" style="background:rgba(0,135,106,.3)">%s</mark>' % (tip, g)
        a = 0.2 + 0.6 * abs(w[g]) / top
        rgb = "179,95,0" if w[g] > 0 else "15,92,140"
        return '<mark title="%s" style="background:rgba(%s,%.2f)">%s</mark>' % (tip, rgb, a, g)

    out, pos = [], 0
    for m in pattern.finditer(text):
        out.append(_esc(text[pos:m.start()]))
        out.append(mark(m))
        pos = m.end()
    out.append(_esc(text[pos:]))
    body = "".join(out).replace("\n", "</p><p>")
    return '<div class="hl"><p>%s</p></div>' % body


# ------------------------------------------------------------------ plots
_font_name = None


def use_font():
    """Make the bundled Chinese font known to matplotlib (once) and return its family name."""
    global _font_name
    if _font_name is None:
        import base64, json, os, tempfile
        from matplotlib import font_manager
        with open("data/ch3/font.json", encoding="utf-8") as f:
            info = json.load(f)
        path = os.path.join(tempfile.gettempdir(), "lab_ch3_font.ttf")
        with open(path, "wb") as f:
            f.write(base64.b64decode(info["b64"]))
        font_manager.fontManager.addfont(path)
        _font_name = info["name"]
    return _font_name


def _plt():
    import matplotlib
    matplotlib.use("agg")
    import matplotlib.pyplot as plt
    return plt


def _style():
    return {"font.family": [use_font(), "DejaVu Sans"], "font.size": 11, "axes.edgecolor": MUTED, "axes.labelcolor": INK,
            "xtick.color": INK, "ytick.color": INK, "text.color": INK, "figure.facecolor": CREAM, "axes.facecolor": CREAM,
            "axes.spines.top": False, "axes.spines.right": False, "legend.frameon": False, "savefig.facecolor": CREAM}


def _glosses(ax, grams):
    ax.set_yticks(range(len(grams)))
    ax.set_yticklabels([label(g) for g in grams], fontsize=11)


def rates_plot(lx_rate, zzr_rate):
    """The 31 characters, two bars each: how often per 1,000 characters Lu Xun (orange) and Zhou Zuoren (blue) write them."""
    import numpy as np
    plt = _plt()
    order = np.argsort(-(np.array(lx_rate) - np.array(zzr_rate)))
    g = [GRAMS[k] for k in order]
    with plt.rc_context(_style()):
        fig, ax = plt.subplots(figsize=(8, 9.2))
        y = np.arange(len(g))
        ax.barh(y - 0.2, [lx_rate[k] for k in order], height=0.4, color=ORANGE, label="Lu Xun")
        ax.barh(y + 0.2, [zzr_rate[k] for k in order], height=0.4, color=BLUE, label="Zhou Zuoren")
        _glosses(ax, g)
        ax.invert_yaxis()
        ax.set_xlabel("times per 1,000 characters")
        ax.legend(loc="lower right", fontsize=12)
        ax.set_title("How often each brother uses the 31 characters", loc="left", fontsize=13)
        fig.tight_layout()
    return fig


def gap_plot(lx_rate, zzr_rate, k=12):
    """The k biggest gaps (Lu Xun minus Zhou Zuoren, per 1,000 characters), as bars from a middle line."""
    import numpy as np
    plt = _plt()
    gap = np.array(lx_rate) - np.array(zzr_rate)
    pick = sorted(np.argsort(-np.abs(gap))[:k], key=lambda i: -gap[i])
    with plt.rc_context(_style()):
        fig, ax = plt.subplots(figsize=(8, 5.6))
        ax.barh(range(k), [gap[i] for i in pick], color=[ORANGE if gap[i] > 0 else BLUE for i in pick], height=0.7)
        _glosses(ax, [GRAMS[i] for i in pick])
        ax.invert_yaxis()
        ax.axvline(0, color=INK, lw=1)
        m = max(abs(gap[pick])) * 1.15
        ax.set_xlim(-m, m)
        ax.text(m * 0.97, -0.95, "Lu Xun uses it more  →", ha="right", va="center", color=ORANGE, fontsize=12)
        ax.text(-m * 0.97, -0.95, "←  Zhou Zuoren uses it more", ha="left", va="center", color=BLUE, fontsize=12)
        ax.set_ylim(k - 0.4, -1.4)
        ax.set_xlabel("difference in times per 1,000 characters")
        ax.set_title("The %d biggest differences" % k, loc="left", fontsize=13)
        fig.tight_layout()
    return fig


def two_char_plot(X, y, a, b, X_test=None, names=None):
    """Each piece as one dot, placed by how often it uses character a (across) and character b (up), per 1,000 characters.
    Orange = Lu Xun, blue = Zhou Zuoren, stars = each brother's average, numbered black discs = disputed essays."""
    import numpy as np
    plt = _plt()
    X, y = np.array(X, float) * 1000, np.array(y)
    with plt.rc_context(_style()):
        fig, ax = plt.subplots(figsize=(7.2, 6.0 if X_test is not None else 5.6))
        for v, col, name in [(1, ORANGE, "Lu Xun pieces"), (0, BLUE, "Zhou Zuoren pieces")]:
            ax.scatter(X[y == v, a], X[y == v, b], s=85, color=col, edgecolors="white", linewidths=1, alpha=.92, label=name, zorder=3)
            ax.scatter(X[y == v, a].mean(), X[y == v, b].mean(), s=330, marker="*", color=col, edgecolors=INK, linewidths=1.2, zorder=4)
        if X_test is not None:
            T = np.array(X_test, float) * 1000
            ax.scatter(T[:, a], T[:, b], s=330, color=INK, edgecolors="white", linewidths=1.2, label="disputed essays (numbered)", zorder=5)
            for i, (tx, ty) in enumerate(zip(T[:, a], T[:, b]), 1):
                ax.text(tx, ty, str(i), ha="center", va="center", color="white", fontsize=10.5, zorder=6)
            fig.text(0.5, 0.005, "   ".join("%d = %s" % (i, nm) for i, nm in enumerate(names, 1)), ha="center", va="bottom", fontsize=11)
        ax.set_xlabel("%s (%s) per 1,000 characters" % (GRAMS[a], GLOSS[GRAMS[a]]), fontsize=12)
        ax.set_ylabel("%s (%s) per 1,000 characters" % (GRAMS[b], GLOSS[GRAMS[b]]), fontsize=12)
        ax.legend(loc="upper left", fontsize=11)
        ax.set_title("Each dot is one piece (stars = the averages)", loc="left", fontsize=13)
        ax.grid(color="#E6E1D6", lw=.8, zorder=0)
        fig.tight_layout(rect=(0, 0.04 if X_test is not None else 0, 1, 1))
    return fig


def pca_map(pca, P_train, y_train, P_val=None, y_val=None, P_test=None, names=None):
    """The 31 numbers of each piece squashed to 2 (PCA, already fitted). Dots = training pieces, triangles = validation pieces,
    numbered black discs = disputed essays; orange = Lu Xun, blue = Zhou Zuoren."""
    import numpy as np
    plt = _plt()
    A, yt = pca.transform(P_train), np.array(y_train)
    with plt.rc_context(_style()):
        fig, ax = plt.subplots(figsize=(7.8, 6.6))
        for v, col, name in [(1, ORANGE, "Lu Xun (training)"), (0, BLUE, "Zhou Zuoren (training)")]:
            ax.scatter(A[yt == v, 0], A[yt == v, 1], s=80, color=col, edgecolors="white", linewidths=1, alpha=.92, label=name, zorder=3)
        if P_val is not None:
            B, yv = pca.transform(P_val), np.array(y_val)
            for v, col, name in [(1, ORANGE, "Lu Xun (validation)"), (0, BLUE, "Zhou Zuoren (validation)")]:
                ax.scatter(B[yv == v, 0], B[yv == v, 1], s=75, marker="^", facecolors="none", edgecolors=col, linewidths=1.6, label=name, zorder=3)
        if P_test is not None:
            C = pca.transform(P_test)
            ax.scatter(C[:, 0], C[:, 1], s=420, color=INK, edgecolors="white", linewidths=1.2, label="disputed essays (numbered)", zorder=5)
            for i, (cx, cy) in enumerate(C, 1):
                ax.text(cx, cy, str(i), ha="center", va="center", color="white", fontsize=11, zorder=6)
            fig.text(0.5, 0.005, "   ".join("%d = %s" % (i, nm) for i, nm in enumerate(names, 1)), ha="center", va="bottom", fontsize=11.5)
        ev = pca.explained_variance_ratio_
        ax.set_xlabel("map direction 1  (holds %.0f%% of the differences)" % (100 * ev[0]), fontsize=11)
        ax.set_ylabel("map direction 2  (%.0f%%)" % (100 * ev[1]), fontsize=11)
        ax.grid(color="#E6E1D6", lw=.8, zorder=0)
        ax.set_title("A map of the pieces: similar pieces sit close together", loc="left", fontsize=13)
        h, lab = ax.get_legend_handles_labels()
        ax.legend(h, lab, loc="upper center", bbox_to_anchor=(0.5, -0.12), ncol=2, fontsize=10)
        fig.tight_layout(rect=(0, 0.04 if P_test is not None else 0, 1, 1))
    return fig


def score_curve(scores, y):
    """The S-curve that turns a score into a probability, with the training pieces sitting on it."""
    import numpy as np
    plt = _plt()
    scores, y = np.array(scores), np.array(y)
    m = max(6.0, float(np.abs(scores).max()) + 1)
    s = np.linspace(-m, m, 300)
    with plt.rc_context(_style()):
        fig, ax = plt.subplots(figsize=(7.6, 4.8))
        ax.plot(s, 1 / (1 + np.exp(-s)), color=INK, lw=2.2, zorder=2)
        ax.axhline(0.5, color=MUTED, ls="--", lw=1.2)
        ax.axvline(0, color=MUTED, ls="--", lw=1.2)
        for v, col, name in [(1, ORANGE, "Lu Xun training pieces"), (0, BLUE, "Zhou Zuoren training pieces")]:
            ax.scatter(scores[y == v], 1 / (1 + np.exp(-scores[y == v])), s=75, color=col, edgecolors="white", linewidths=1, label=name, zorder=3)
        ax.text(-m * 0.97, 0.53, "50%: no lean either way", color=MUTED, fontsize=11)
        ax.set_xlabel("the model's score  (negative = Zhou Zuoren side, positive = Lu Xun side)")
        ax.set_ylabel("P(Lu Xun)")
        ax.set_xlim(-m, m)
        ax.set_ylim(-0.03, 1.03)
        ax.legend(loc="center right", fontsize=11, bbox_to_anchor=(1.0, 0.3))
        ax.set_title("From score to probability", loc="left", fontsize=13)
        fig.tight_layout()
    return fig


def weights_plot(weights):
    """All 31 weights as bars from a middle line, strongest Lu Xun side first. Orange = pushes towards Lu Xun, blue = towards Zhou Zuoren."""
    import numpy as np
    plt = _plt()
    order = np.argsort(-np.array(weights))
    w = [weights[k] for k in order]
    with plt.rc_context(_style()):
        fig, ax = plt.subplots(figsize=(8, 9))
        ax.barh(range(len(w)), w, color=[ORANGE if x > 0 else BLUE for x in w], height=0.72)
        _glosses(ax, [GRAMS[k] for k in order])
        ax.invert_yaxis()
        ax.axvline(0, color=INK, lw=1)
        m = max(abs(x) for x in w) * 1.12
        ax.set_xlim(-m, m)
        ax.text(m * 0.98, -1.1, "pushes towards Lu Xun  →", ha="right", va="center", color=ORANGE, fontsize=12)
        ax.text(-m * 0.98, -1.1, "←  pushes towards Zhou Zuoren", ha="left", va="center", color=BLUE, fontsize=12)
        ax.set_ylim(len(w) - 0.4, -1.7)
        ax.set_xlabel("weight the model learned")
        ax.set_title("What the model learned about each character", loc="left", fontsize=13)
        fig.tight_layout()
    return fig


def check_plot(p_val, y_val):
    """The held-out check: one dot per validation piece, placed by the model's P(Lu Xun). Top row = pieces really by Lu Xun,
    bottom row = pieces really by Zhou Zuoren. Dots on the wrong side of the 50% line are ringed."""
    import numpy as np
    plt = _plt()
    p, y = np.array(p_val), np.array(y_val)
    rng = np.random.default_rng(4)
    with plt.rc_context(_style()):
        fig, ax = plt.subplots(figsize=(8.4, 4.2))
        ax.axvspan(0, 0.5, color="#E3EAF0", zorder=0)
        ax.axvspan(0.5, 1, color="#F1E7D8", zorder=0)
        for v, row, col in [(1, 1, ORANGE), (0, 0, BLUE)]:
            m = y == v
            yy = row + rng.uniform(-0.2, 0.2, m.sum())
            ax.scatter(p[m], yy, s=90, color=col, edgecolors="white", linewidths=1, zorder=3)
            wrong = (p[m] > 0.5) != (v == 1)
            ax.scatter(p[m][wrong], yy[wrong], s=330, facecolors="none", edgecolors=INK, linewidths=2, zorder=4)
            right = int((~wrong).sum())
            ax.text(1.04, row, "%d of %d right" % (right, m.sum()), va="center", fontsize=12, color=col, clip_on=False)
        ax.axvline(0.5, color=INK, ls="--", lw=1.6)
        ax.text(0.25, 1.62, "model says Zhou Zuoren", ha="center", color=BLUE, fontsize=11.5)
        ax.text(0.75, 1.62, "model says Lu Xun", ha="center", color=ORANGE, fontsize=11.5)
        ax.set_yticks([0, 1])
        ax.set_yticklabels(["really\nZhou Zuoren", "really\nLu Xun"], fontsize=11.5)
        ax.set_xlim(0, 1.02)
        ax.set_ylim(-0.5, 1.75)
        ax.set_xlabel("the model's P(Lu Xun) for each piece it had never seen")
        ax.spines["left"].set_visible(False)
        ax.tick_params(axis="y", length=0)
        ax.set_title("The check on held-out pieces (ringed = wrong)", loc="left", fontsize=13)
        fig.tight_layout()
    return fig


def push_plot(contributions, title, n=8):
    """For one text: how much each character pushed the score, the n strongest pushes (orange = towards Lu Xun, blue = towards Zhou Zuoren)."""
    import numpy as np
    plt = _plt()
    c = np.array(contributions)
    pick = sorted(np.argsort(-np.abs(c))[:n], key=lambda i: -c[i])
    with plt.rc_context(_style()):
        fig, ax = plt.subplots(figsize=(8, 4.8))
        ax.barh(range(n), [c[i] for i in pick], color=[ORANGE if c[i] > 0 else BLUE for i in pick], height=0.7)
        _glosses(ax, [GRAMS[i] for i in pick])
        ax.invert_yaxis()
        ax.axvline(0, color=INK, lw=1)
        m = max(abs(c[pick])) * 1.15
        ax.set_xlim(-m, m)
        ax.set_xlabel("push on the score")
        ax.set_title("The %d biggest pushes in %s" % (n, title), loc="left", fontsize=13)
        fig.tight_layout()
    return fig


def verdict_plot(titles_zh, titles_en, probs):
    """One row per disputed essay: a bar of width 1 split into blue (P Zhou Zuoren) and orange (P Lu Xun), with the 50% line."""
    import textwrap
    plt = _plt()
    n = len(probs)
    with plt.rc_context(_style()):
        fig, ax = plt.subplots(figsize=(9.2, 1.3 * n + 1.6))
        for i, (zh, en, p) in enumerate(zip(titles_zh, titles_en, probs)):
            ax.barh(i, 1 - p, left=0, height=0.62, color=BLUE)
            ax.barh(i, p, left=1 - p, height=0.62, color=ORANGE)
            ax.text(0.985, i, "P(Lu Xun) = %.3f" % p, ha="right", va="center", color="white", fontsize=12.5)
            if 1 - p > 0.1:
                ax.text(0.012, i, "%.3f" % (1 - p), ha="left", va="center", color="white", fontsize=11)
        ax.set_yticks(range(n))
        ax.set_yticklabels(["%s\n%s" % (zh, textwrap.fill(en.replace("\u2019", "'"), 34)) for zh, en in zip(titles_zh, titles_en)], fontsize=11)
        ax.invert_yaxis()
        ax.plot([0.5, 0.5], [-0.5, n - 0.5], color=INK, ls="--", lw=2, zorder=5)
        ax.text(0.5, -0.58, "50%: no lean either way", ha="center", va="bottom", fontsize=11)
        ax.text(0.0, n - 0.42, "← more like Zhou Zuoren", ha="left", va="top", color=BLUE, fontsize=12)
        ax.text(1.0, n - 0.42, "more like Lu Xun →", ha="right", va="top", color=ORANGE, fontsize=12)
        ax.set_xlim(0, 1)
        ax.set_ylim(n - 0.1, -1.05)
        ax.set_xticks([])
        for s_ in ("left", "bottom"):
            ax.spines[s_].set_visible(False)
        ax.tick_params(axis="y", length=0)
        ax.set_title("Who does the model think wrote each disputed essay?", loc="left", fontsize=13)
        fig.tight_layout()
    return fig
```

---

## Helper module lab_ch4.py (imported by the lab cells)
```python
"""Chapter 4 helpers (Glassdoor v. Machine Zone, a what-if): the EBG loader, the 224-function-word attacker and a few small utilities.

The attacker (FW224Attacker) counts the 224 function words of Chapter 2 in a text and uses a logistic regression
(Normalizer l1 -> StandardScaler -> LogisticRegression C=1).
It gives every candidate a probability; the candidate with the highest one is the attacker's top guess.
(FWAttacker and Char3Attacker below are only used by the legacy Riddell-Juola page, index.html#ch4rj.)
scikit-learn / numpy are imported inside the functions, so this file loads even before they are downloaded.
"""
import hashlib
import json
import re
from statistics import median

TOK = re.compile(r"[a-z]+(?:'[a-z]+)?")


def load_json(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def words(text):
    """Lower-case words (letters and inner apostrophes), the same tokenizer as Chapter 2."""
    return TOK.findall(text.lower().replace("’", "'"))


def fw_matrix(texts, fw):
    """Rows = texts, columns = function words, values = occurrences per 100 words."""
    import numpy as np
    idx = {w: i for i, w in enumerate(fw)}
    M = np.zeros((len(texts), len(fw)))
    for r, t in enumerate(texts):
        toks = words(t)
        for w in toks:
            if w in idx:
                M[r, idx[w]] += 1
        M[r] *= 100 / max(len(toks), 1)
    return M


class FW224Attacker:
    """The lab's one simple attacker: 224 function-word counts + logistic regression."""
    title = "224 function words + logistic regression"

    def __init__(self, texts, labels, words):
        import numpy as np
        from sklearn.linear_model import LogisticRegression
        from sklearn.pipeline import make_pipeline
        from sklearn.preprocessing import Normalizer, StandardScaler
        import lab_helpers as H
        self.words, self.H = words, H
        X = np.array([H.fw_counts(t, words) for t in texts])
        # multinomial (softmax) for 45 authors is scikit-learn's default with lbfgs
        self.model = make_pipeline(Normalizer(norm="l1"), StandardScaler(),
                                   LogisticRegression(C=1, solver="lbfgs", max_iter=10000)).fit(X, labels)
        self.classes_ = self.model[-1].classes_

    def scores(self, text):
        p = self.model.predict_proba([self.H.fw_counts(text, self.words)])[0]
        return dict(zip(self.classes_, p))


class FWAttacker:
    """Attacker 1: function-word frequencies + logistic regression (probabilities add up to 1)."""
    title = "Attacker 1 (function words + logistic regression)"

    def __init__(self, texts, labels, fw):
        from sklearn.linear_model import LogisticRegression
        from sklearn.preprocessing import StandardScaler
        self.fw = fw
        X = fw_matrix(texts, fw)
        self.sc = StandardScaler().fit(X)
        self.model = LogisticRegression(C=0.1, max_iter=2000).fit(self.sc.transform(X), labels)

    def scores(self, text):
        p = self.model.predict_proba(self.sc.transform(fw_matrix([text], self.fw)))[0]
        return dict(zip(self.model.classes_, p))


class Char3Attacker:
    """Attacker 2: every run of three characters (the, ing, ...) + a linear support vector machine."""
    title = "Attacker 2 (character 3-grams + SVM)"

    def __init__(self, texts, labels):
        from sklearn.feature_extraction.text import CountVectorizer
        from sklearn.preprocessing import normalize
        from sklearn.svm import LinearSVC
        self.cv = CountVectorizer(analyzer="char", ngram_range=(3, 3), max_features=1500)
        self.norm = normalize
        self.model = LinearSVC(C=10, max_iter=20000).fit(normalize(self.cv.fit_transform(texts).astype(float)), labels)

    def scores(self, text):
        s = self.model.decision_function(self.norm(self.cv.transform([text]).astype(float)))[0]
        return dict(zip(self.model.classes_, s))


def rank_of(scores, who):
    """1 = the attacker's top guess is `who`; 2 = `who` is second; ..."""
    return 1 + sum(1 for a, s in scores.items() if s > scores[who])


def top_guess(scores):
    return str(max(scores, key=scores.get))


# ---------------------------------------------------------------- EBG corpus (downloaded by the page, checked here)
def _decode(raw):
    try:
        return raw.decode("utf-8")
    except UnicodeDecodeError:
        return raw.decode("cp1252", errors="replace")


def load_ebg(manifest="data/ch4/ebg_manifest.json", root="data/ch4/ebg"):
    """Read the EBG files the page downloaded and check each one against the SHA-256 in the manifest.

    Returns (authors, train, test, obf, imi):
      train[a] = list of the author's pre-existing texts (~500 words each); test[a] = held-out text <a>_01_1.txt;
      obf[a] = the author's own attempt to obfuscate; imi[a] = the author's attempt to imitate Cormac McCarthy (first file).
    """
    man = load_json(manifest)
    train, test, obf, imi = {}, {}, {}, {}
    for f in man["files"]:
        with open(f"{root}/{f['p']}", "rb") as fh:
            raw = fh.read()
        if hashlib.sha256(raw).hexdigest() != f["sha256"]:
            raise ValueError(f"{f['p']} does not match the pinned commit (SHA-256 differs)")
        a, text = f["p"].split("/")[0], _decode(raw)
        if f["role"] == "train":
            train.setdefault(a, []).append(text)
        elif f["role"] == "test":
            test[a] = text
        elif f["role"] == "obfuscation":
            obf[a] = text
        elif f["role"] == "imitation" and f["p"].endswith("_imitation_01.txt"):
            imi[a] = text
    return sorted(train), train, test, obf, imi


def ranks_all(attacker, rewrites):
    """{author: rank of the true author} for a dict {author: text}; same as ranks_of."""
    return ranks_of(attacker, rewrites)


def ranks_of(attacker, texts):
    """{author: rank of the true author} for a dict {author: text} (1 = the attacker's top guess is the true author)."""
    return {a: rank_of(attacker.scores(t), a) for a, t in texts.items()}


def summary(ranks):
    """(caught at rank 1, within top 5, median rank) as table cells, for a dict of ranks."""
    r = list(ranks.values())
    n = len(r)
    k1, k5 = sum(x == 1 for x in r), sum(x <= 5 for x in r)
    return [f"{k1}/{n} ({k1 / n:.0%})", f"{k5}/{n} ({k5 / n:.0%})", f"{median(r):g}"]


def pick_john_doe(attacker, test):
    """Transparent rule: among the authors whose held-out text the attacker ranks first, sort by the probability it gave the true author
    and take the middle one (the lower of the two middle ones when the count is even). Returns (john_doe, the sorted list of (author, probability))."""
    sc = {a: attacker.scores(t) for a, t in test.items()}
    caught = sorted(((a, sc[a][a]) for a in test if rank_of(sc[a], a) == 1), key=lambda x: x[1])
    return caught[(len(caught) - 1) // 2][0], caught


def pooled(rank_dicts):
    """Pool several {author: rank} dicts (e.g. the same strategy by four models) into one dict {(i, author): rank}."""
    out = {}
    for i, d in enumerate(rank_dicts):
        for a, r in d.items():
            out[(i, a)] = r
    return out


def rank_among(attacker, text, who=None):
    """Rank every candidate for `text`. Returns (list of (candidate, probability) from most to least likely, rank and probability of `who`)."""
    sc = attacker.scores(text)
    order = sorted(sc, key=sc.get, reverse=True)
    return [(c, sc[c]) for c in order], (rank_of(sc, who), sc[who]) if who is not None else None


# ================================================================ Case 4 as a defence project: John Doe's side
# Colours (lecture palette): translation = TEAL, write differently = BLUE, simple English = PURPLE, McCarthy style = ORANGE, no disguise = INK / GREY.
BLUE, ORANGE, TEAL, PURPLE = "#0F5C8C", "#B35F00", "#00876A", "#A9568F"
GREY, INK, MUTED, CREAM, PALE = "#9E978A", "#1F2430", "#6B6458", "#F7F5F0", "#E4DFD3"

STRATEGIES = [("obfuscation", "Write differently (model)"), ("backtranslation", "Translation round trip"),
              ("simplification", "Simple English"), ("imitation", "McCarthy style")]
COLOR = {"none": INK, "human": BLUE, "obfuscation": BLUE, "backtranslation": TEAL, "simplification": PURPLE, "imitation": ORANGE}
LABEL = dict(STRATEGIES, none="No disguise", human="Write differently (by hand)")
CHANCE = 1                       # by luck, 1 writer in 45 is named first: 1 of 45 (2.2%)


def _plt():
    import matplotlib
    matplotlib.use("agg")
    import matplotlib.pyplot as plt
    return plt


def _axes(figsize, ax=None):
    """A cream figure with one clean axis (no top / right spine)."""
    plt = _plt()
    fig, ax = plt.subplots(figsize=figsize, dpi=100)
    fig.patch.set_facecolor(CREAM)
    ax.set_facecolor(CREAM)
    for k in ("top", "right"):
        ax.spines[k].set_visible(False)
    for k in ("left", "bottom"):
        ax.spines[k].set_color(MUTED)
    ax.tick_params(colors=INK, labelsize=10)
    return fig, ax


def _clean(ax):
    ax.set_facecolor(CREAM)
    for k in ("top", "right"):
        ax.spines[k].set_visible(False)
    for k in ("left", "bottom"):
        ax.spines[k].set_color(MUTED)
    ax.tick_params(colors=INK, labelsize=10)


def words_kept(original, new):
    """Share of the original's words that are still in the new text (0 to 1). Words are counted with their repeats."""
    from collections import Counter
    a, b = Counter(words(original)), Counter(words(new))
    return sum(min(n, b[w]) for w, n in a.items()) / max(sum(a.values()), 1)


def rates(texts, ws):
    """How often each word in `ws` appears per 100 words, over all the given texts together."""
    from collections import Counter
    c, n = Counter(), 0
    for t in texts:
        tk = words(t)
        c.update(tk)
        n += len(tk)
    return {w: 100 * c[w] / max(n, 1) for w in ws}


def strip_plot(known, review_rates, doe, ws, title):
    """One row per small word: every writer (grey dot). With `doe`: the other 44 writers, John Doe's known writing (diamond), his review (star)."""
    plt = _plt()
    import numpy as np
    n = len(ws)
    fig, axes = plt.subplots(n, 1, figsize=(8, 1.3 * n + 1.1), dpi=100, squeeze=False)
    fig.patch.set_facecolor(CREAM)
    rng = np.random.default_rng(2)
    for ax, w in zip(axes[:, 0], ws):
        _clean(ax)
        others = [known[a][w] for a in known if a != doe]
        ax.scatter(others, rng.uniform(-0.2, 0.2, len(others)), s=34, color=GREY, alpha=0.85, zorder=2, label="44 other writers" if doe else "45 writers")
        vals = list(others)
        if doe:
            ax.scatter([known[doe][w]], [0], s=120, marker="D", color=INK, zorder=3, label="John Doe's known writing")
            ax.scatter([review_rates[w]], [0], s=260, marker="*", color=INK, edgecolors=CREAM, linewidths=1, zorder=4, label="John Doe's review")
            vals += [known[doe][w], review_rates[w]]
        pad = (max(vals) - min(vals)) * 0.07
        ax.set_xlim(min(vals) - pad, max(vals) + pad)
        ax.set_ylim(-0.5, 0.5)
        ax.set_yticks([])
        ax.spines["left"].set_visible(False)
        ax.set_ylabel('"%s"' % w, rotation=0, ha="right", va="center", fontsize=13, color=INK)
    axes[-1, 0].set_xlabel("times per 100 words (each row has its own scale)", fontsize=10, color=INK)
    h, lab = axes[0, 0].get_legend_handles_labels()
    fig.suptitle(title, y=1.0, fontsize=13, fontweight="bold", color=INK)
    fig.legend(h, lab, loc="upper center", bbox_to_anchor=(0.5, 0.965), ncol=3, frameon=False, fontsize=10)
    fig.tight_layout(rect=(0, 0, 1, 0.86))
    return fig


def rank_bars(scores, who, color, title, ax=None, name="John Doe"):
    """The attacker's probability for each of the 45 candidates, best first. `who` is highlighted."""
    own = ax is None
    if own:
        fig, ax = _axes((9, 4))
    else:
        fig = ax.figure
        _clean(ax)
    order = sorted(scores, key=scores.get, reverse=True)
    vals = [scores[c] for c in order]
    cols = [color if c == who else GREY for c in order]
    ax.bar(range(1, len(order) + 1), vals, color=cols, width=0.8, zorder=2)
    r = order.index(who) + 1
    ax.set_xlim(0, len(order) + 1)
    top = max(vals)
    ax.set_ylim(0, top * 1.28)
    text = "%s: rank %d of %d" % (name, r, len(order))
    if scores[who] > 0.5 * top:
        ax.annotate(text, xy=(r, scores[who]), xytext=(r + 5, top * 1.12), fontsize=11.5, fontweight="bold", color=color,
                    arrowprops=dict(arrowstyle="-", color=color, lw=1.5), ha="left", va="center")
    else:                                    # a tiny bar: mark it with a triangle so it can be found
        ax.scatter([r], [scores[who] + top * 0.04], marker="v", s=120, color=color, zorder=4)
        ax.annotate(text, xy=(r, scores[who] + top * 0.08), xytext=(min(max(r, 10), 36), top * 0.4), fontsize=11.5, fontweight="bold",
                    color=color, arrowprops=dict(arrowstyle="-", color=color, lw=1.5), ha="center", va="bottom")
    ax.set_xlabel("the 45 candidates, from the attacker's best guess (1) to its last (45)", fontsize=10, color=INK)
    ax.set_ylabel("how likely the attacker thinks\nit is this writer", fontsize=10, color=INK)
    ax.set_title(title, fontsize=13, fontweight="bold", color=INK, loc="left")
    if own:
        fig.tight_layout()
    return fig


def waffle(ranks, color, title, doe=None, ax=None):
    """45 squares, one per writer. Coloured = the attacker names this writer first (caught). Pale = not caught."""
    own = ax is None
    if own:
        fig, ax = _axes((8, 3.4))
    else:
        fig = ax.figure
    cols, rows = 15, 3
    names = sorted(ranks, key=lambda a: (ranks[a], a))
    for i, a in enumerate(names):
        x, y = i % cols, rows - 1 - i // cols
        hit = ranks[a] == 1
        ax.add_patch(_plt().Rectangle((x + 0.06, y + 0.06), 0.88, 0.88, facecolor=color if hit else PALE, edgecolor=INK if a == doe else "none", lw=2.5, zorder=2))
    k = sum(1 for v in ranks.values() if v == 1)
    ax.set_xlim(-0.1, cols + 0.1)
    ax.set_ylim(-0.1, rows + 0.1)
    ax.set_aspect("equal")
    ax.axis("off")
    ax.set_title(title, fontsize=13, fontweight="bold", color=INK, loc="left")
    ax.text(cols / 2, -0.55, "%d of %d writers caught at rank 1   (pure luck: about %d)" % (k, len(ranks), CHANCE),
            ha="center", va="top", fontsize=11.5, color=color if color != GREY else INK, fontweight="bold")
    if own:
        fig.tight_layout()
    return fig


def slope(before, after, color, title, doe=None, after_label="after the disguise"):
    """Each writer's rank before and after: a line per writer. John Doe's line is thick. Rank 1 is at the top."""
    plt = _plt()
    fig, ax = _axes((6.4, 5.2))
    for a in before:
        isd = a == doe
        ax.plot([0, 1], [before[a], after[a]], color=color if isd else GREY, lw=3.5 if isd else 1, alpha=1 if isd else 0.55, zorder=3 if isd else 2)
    ax.scatter([0] * len(before), [before[a] for a in before], s=14, color=INK, zorder=4)
    ax.scatter([1] * len(before), [after[a] for a in before], s=14, color=color, zorder=4)
    ax.set_yscale("log")
    ax.set_ylim(48, 0.8)
    ax.set_yticks([1, 2, 5, 10, 20, 45])
    ax.set_yticklabels(["1  (named first)", "2", "5", "10", "20", "45  (named last)"])
    ax.minorticks_off()
    ax.set_xlim(-0.25, 1.25)
    ax.set_xticks([0, 1])
    ax.set_xticklabels(["no disguise", after_label], fontsize=11)
    ax.set_ylabel("rank of the true writer\n(1 = the attacker names him first)", fontsize=10, color=INK)
    if doe is not None:
        ax.annotate("John Doe: %d → %d" % (before[doe], after[doe]), xy=(1, after[doe]), xytext=(1.04, after[doe] * (0.85 if after[doe] > 3 else 1.5)),
                    fontsize=11, fontweight="bold", color=color, va="center")
    ax.set_title(title, fontsize=13, fontweight="bold", color=INK, loc="left")
    fig.tight_layout()
    return fig


def bucket_bars(before, after, color, name, title):
    """How the 45 writers spread over rank groups: no disguise (grey) vs one strategy (colour). `after` may pool several models;
    counts are scaled to 'per 45 writers'."""
    import numpy as np
    groups = [("rank 1\n(caught)", 1, 1), ("rank 2-5", 2, 5), ("rank 6-15", 6, 15), ("rank 16-45\n(well hidden)", 16, 45)]

    def count(d):
        v = np.array(list(d.values()))
        return [45 * float(((v >= lo) & (v <= hi)).sum()) / len(v) for _, lo, hi in groups]

    b, a = count(before), count(after)
    fig, ax = _axes((8, 4))
    x = np.arange(len(groups))
    ax.bar(x - 0.2, b, 0.38, color=INK, label="no disguise", zorder=2)
    ax.bar(x + 0.2, a, 0.38, color=color, label=name, zorder=2)
    for xi, v in zip(x - 0.2, b):
        ax.text(xi, v + 0.5, "%.0f" % v, ha="center", fontsize=10.5, color=INK)
    for xi, v in zip(x + 0.2, a):
        ax.text(xi, v + 0.5, "%.0f" % v, ha="center", fontsize=10.5, color=color, fontweight="bold")
    ax.set_xticks(x)
    ax.set_xticklabels([g[0] for g in groups], fontsize=10.5)
    ax.set_ylabel("writers (out of 45)", fontsize=10, color=INK)
    ax.set_ylim(0, max(b + a) * 1.2)
    ax.legend(frameon=False, fontsize=10.5, loc="upper right")
    ax.set_title(title, fontsize=13, fontweight="bold", color=INK, loc="left")
    fig.tight_layout()
    return fig


def strategy_compare(rows, title="Can the attacker still find the writers?"):
    """rows = [(key, label, caught_per_45, top5_per_45, [caught_per_45 for each model] or None)].
    A bar per strategy: writers still caught at rank 1 (out of 45). Black dots = single models. Hollow circle = within the top 5."""
    fig, ax = _axes((9, 0.62 * len(rows) + 1.6))
    ys = list(range(len(rows)))[::-1]
    for y, (key, label, k1, k5, per) in zip(ys, rows):
        ax.barh(y, k1, height=0.6, color=COLOR[key], hatch="///" if key == "human" else None, edgecolor=CREAM if key == "human" else COLOR[key], zorder=2)
        ax.text(max([k1] + (per or [])) + 0.9, y, "%.0f" % k1, va="center", fontsize=11.5, fontweight="bold", color=COLOR[key])
        if per:
            ax.scatter(per, [y] * len(per), s=26, color=INK, zorder=4)
        ax.scatter([k5], [y], s=70, facecolors="none", edgecolors=INK, linewidths=1.6, zorder=3)
    ax.axvline(CHANCE, color=INK, ls="--", lw=1.2, zorder=1)
    ax.text(CHANCE + 0.5, len(rows) - 0.35, "pure luck: 1", fontsize=10, color=INK, va="center")
    ax.set_yticks(ys)
    ax.set_yticklabels([r[1] for r in rows], fontsize=11)
    ax.set_xlim(0, 47)
    ax.set_ylim(-0.6, len(rows) - 0.1)
    ax.set_xlabel("writers still named first by the attacker (out of 45)\nbar = all models together; black dots = single models; hollow circle = writer within its top 5", fontsize=10, color=INK)
    ax.set_title(title, fontsize=13, fontweight="bold", color=INK, loc="left")
    fig.tight_layout()
    return fig


def tradeoff_plot(points, title="How much of John Doe's text survives, and how well it hides him"):
    """points = {strategy: [(share of John Doe's words kept, rank of the true writer), ...]} for rewrites of all 45 writers.
    Rank on a log scale (1 at the top = caught). Big marker = the median of the strategy."""
    import numpy as np
    fig, ax = _axes((8.6, 5))
    rng = np.random.default_rng(4)
    for key, pts in points.items():
        x = np.array([p[0] for p in pts]) * 100
        y = np.array([p[1] for p in pts], float) * np.exp(rng.uniform(-0.07, 0.07, len(pts)))
        ax.scatter(x, y, s=16, color=COLOR[key], alpha=0.35, edgecolors="none", zorder=2)
    for key, pts in points.items():
        mx, my = np.median([p[0] for p in pts]) * 100, np.median([p[1] for p in pts])
        ax.scatter([mx], [my], s=210, color=COLOR[key], edgecolors=INK, linewidths=1.6, zorder=4, label=LABEL[key])
    ax.set_yscale("log")
    ax.set_yticks([1, 2, 5, 10, 20, 45])
    ax.set_yticklabels(["1", "2", "5", "10", "20", "45"])
    ax.minorticks_off()
    ax.axhspan(0.8, 1.5, color=PALE, zorder=0)
    ax.text(99, 1.0, "caught", fontsize=10, color=MUTED, ha="right", va="center")
    ax.set_xlim(0, 100)
    ax.set_xlabel("words of John Doe's text that survive (%)    ←  rewritten more        kept more  →", fontsize=10, color=INK)
    ax.set_ylabel("rank of the true writer\n(1 = named first; lower down = better hidden)", fontsize=10, color=INK)
    ax.set_ylim(52, 0.8)
    ax.legend(frameon=False, fontsize=10, loc="upper center", bbox_to_anchor=(0.5, -0.16), ncol=4)
    ax.set_title(title, fontsize=13, fontweight="bold", color=INK, loc="left")
    fig.tight_layout()
    return fig


def doe_grid(table, doe_name="John Doe"):
    """table[strategy][model] = (rank, words kept). One cell per rewrite; the stronger the colour, the better John Doe is hidden."""
    import numpy as np
    plt = _plt()
    models = list(next(iter(table.values())))
    fig, ax = _axes((8.4, 4))
    ax.axis("off")
    ncol = len(models)
    for i, (key, label) in enumerate(STRATEGIES):
        y = len(STRATEGIES) - 1 - i
        ax.text(-0.15, y + 0.5, label, ha="right", va="center", fontsize=11.5, fontweight="bold", color=COLOR[key])
        for j, m in enumerate(models):
            rank, kept = table[key][m]
            strength = min(1.0, (rank - 1) / 24.0)
            face = (1 - strength) * np.array(_rgb(PALE)) + strength * np.array(_rgb(COLOR[key]))
            ax.add_patch(plt.Rectangle((j + 0.04, y + 0.06), 0.92, 0.88, facecolor=tuple(face), edgecolor="none"))
            ink = "white" if strength > 0.55 else INK
            ax.text(j + 0.5, y + 0.58, "rank %d" % rank, ha="center", va="center", fontsize=13, fontweight="bold", color=ink)
            ax.text(j + 0.5, y + 0.28, "%d%% words kept" % round(100 * kept), ha="center", va="center", fontsize=9.5, color=ink)
    for j, m in enumerate(models):
        ax.text(j + 0.5, len(STRATEGIES) + 0.15, m, ha="center", va="bottom", fontsize=10.5, color=INK)
    ax.set_xlim(-0.1, ncol)
    ax.set_ylim(0, len(STRATEGIES) + 0.7)
    ax.set_title("Where does %s rank after each rewrite?" % doe_name, fontsize=13, fontweight="bold", color=INK, loc="left", y=1.02)
    ax.text(0, -0.15, "stronger colour = better hidden;  rank 1 = the attacker still names him first", fontsize=10, color=MUTED, va="top")
    fig.subplots_adjust(left=0.22, right=0.98, top=0.88, bottom=0.1)
    return fig


def _rgb(h):
    return [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]


def own_plot(before, after, who, kept=None):
    """Side by side: the attacker's ranking of the 45 candidates for the original review and for your rewrite."""
    plt = _plt()
    fig, axes = plt.subplots(1, 2, figsize=(11, 4), dpi=100, sharey=True)
    fig.patch.set_facecolor(CREAM)
    rank_bars(before, who, INK, "Original review", ax=axes[0])
    rank_bars(after, who, BLUE, "Your rewrite" + ("  (%d%% of the words kept)" % round(100 * kept) if kept is not None else ""), ax=axes[1])
    axes[1].set_ylabel("")
    fig.suptitle("Can the attacker still find John Doe?", y=1.02, fontsize=14, fontweight="bold", color=INK)
    fig.tight_layout()
    return fig


def compare_rows(none, human, ranks_llm, cfgs):
    """Rows for strategy_compare: (key, label, caught at rank 1 per 45, within top 5 per 45, caught per 45 for each model)."""
    def k(d, n):
        v = list(d.values())
        return 45 * sum(x <= n for x in v) / len(v)
    rows = [("none", LABEL["none"], k(none, 1), k(none, 5), None), ("human", LABEL["human"], k(human, 1), k(human, 5), None)]
    for s, label in STRATEGIES:
        per = [ranks_llm[(s, c)] for c in cfgs]
        pool = pooled(per)
        rows.append((s, label, k(pool, 1), k(pool, 5), [k(d, 1) for d in per]))
    return rows


def tradeoff_points(kept_llm, ranks_llm, cfgs):
    """{strategy: [(share of words kept, rank of the true writer) for every rewrite by every model]}."""
    return {s: [(kept_llm[(s, c)][a], ranks_llm[(s, c)][a]) for c in cfgs for a in ranks_llm[(s, c)]] for s, _ in STRATEGIES}


def doe_table(doe, kept_llm, ranks_llm, cfgs):
    """{strategy: {model: (John Doe's rank, share of his words kept)}} for the grid."""
    return {s: {cfgs[c]["model"].split("/")[-1].replace("-Instruct", "").replace("-it", ""): (ranks_llm[(s, c)][doe], kept_llm[(s, c)][doe]) for c in cfgs} for s, _ in STRATEGIES}
```

---

# Data notes

Provenance, licensing and decisions for each chapter's data. Everything a chapter ships is in `data/chN/` (plus the shared `data/function_words_224.json`). Per-folder licences are summarised in `data/LICENSES.md`.

## Case 1 · Two translations of the Analects (`data/ch1/`)

| Source | Status | What is in this repo |
|---|---|---|
| Lionel Giles, *The Sayings of Confucius* (Wisdom of the East, 1907; the Project Gutenberg edition #46389 is the 1910 Dutton printing) | Public domain; Project Gutenberg licence | Per-chunk function-word counts **and the chunk text** (`chunks.json`), plus four held-out passages and the mystery note X (`step1_passages.json`) |
| Robert Eno, *The Analects of Confucius: An Online Teaching Translation* (v2.21, 2015), https://hdl.handle.net/2022/23420 | Copyright retained. The PDF states: "freely available for use in not for profit educational settings and for personal use. For other purposes, apart from fair use, copyright is not waived." | **Derived counts only** (function-word counts per chunk; `text` is `null`). Plus one short excerpt (Analects 17.8, about 100 words) that Haining already showed on his 2023 slide, quoted for teaching/commentary (`eno_shadows`). |

A public personal website is not clearly a "not for profit educational setting", so the lab does not redistribute Eno's text. Count vectors cannot be turned back into readable text. If Eno gives permission, rerun `tools/build_data.py --include-eno-text`.

How the chunks were made (`tools/build_data.py`):

- Giles (PG #46389) is a **thematic selection**, not the whole of the Analects in book order, so "match by book" is not possible. Both translations are cut into consecutive chunks of about 300 words (a chunk closes at the next saying or paragraph boundary once it holds 300 words; a short left-over joins the previous chunk). Result: 50 Giles chunks and 77 Eno chunks (Books I-XX, translation column only, glosses and commentary excluded).
- Giles: introduction and translator's footnotes excluded; footnote markers and italics underscores removed. Eno: only the left (translation) column of PDF pages 16-126 (`pdfminer.six`); line-break hyphens removed; Chinese characters dropped.
- Held out of training: mystery note X (Giles' own footnote 7 of the first section), Giles' six-shadows passage (17.8), Eno's 17.8, and three further Giles paragraphs.
- Function-word list: the **224-word list** `data/function_words_224.json` (words under `"words"`, plus a credit line), the same list as Case 2. It is derived for this lab: the list is `FW` in `unabom/scripts/verify.py` (the validated Chapter 2 analysis). It replaces the earlier, longer function-word list.
- Features: for every chunk and word, the number of tokens equal to that word, with the tokenizer of `unabom/scripts/verify.py` (lower-case, curly apostrophes straightened, regex `[a-z]+(?:'[a-z]+)?`; `lab_helpers.fw_tokens` / `fw_counts`). Contractions stay whole (*don't* is one token and counts for nothing in the list), so no lone `t` or `s` is a feature.
- `chunks.json` was **rebuilt** with `tools/build_data.py` from the Gutenberg text and Eno's PDF (both kept outside the lab folder). The rebuild gives the same 127 chunks (same ids, texts and word counts as before); only the `fw` counts changed. Eno's text is still not shipped (`text: null`); the counts are derived counts.
- Attacker: `Pipeline(Normalizer(norm="l1"), StandardScaler(), LogisticRegression(C=1, solver="lbfgs", max_iter=10000))`, as in the reproduction's `train.py` (its `multi_class="multinomial"` is omitted because newer scikit-learn removed the argument; lbfgs is multinomial by default, and for two classes it makes no difference). The old `class_weight="balanced"` was dropped.
- Reproduced numbers (native scikit-learn 1.9.1 and in the browser, Pyodide, scikit-learn 1.6): 5-fold cross-validated chunk accuracy 0.819 (127 chunks); "and" + "the" only (the same L1 proportions, two columns): 58%, below the 61% of always answering "Eno"; mystery note X: P(Giles) = 0.980.
- The 3-gram counts and old LLM-disguise steps of the earlier prototype were removed from Case 1 earlier (they moved to Case 4, which no longer uses 3-grams either).

Things to know:

- Chunk-level 5-fold accuracy is about 82% with the 224 function words but only about 58% with "and" and "the" alone (below the 61% you would get by always answering "Eno", since 77 of the 127 chunks are Eno). That is the point of Steps 4 and 5.
- With 300-word chunks, "and" vs "the" overlaps heavily between the two translators. The 2023 slide's cleanly separated scatter (DH23_s9_1.png) cannot be reproduced from these chunks; the counts printed on that slide are on a different scale from what the visible passage texts would give.

## Case 2 · The Unabomber (`data/ch2/`)

Mirrors lecture slide 9. Built by `tools/build_ch2.py` from `unabom/` (it imports `FW`, `tokens`, `chunks`, `build` from `unabom/scripts/verify.py`, so tokenisation, the 224-word function-word list and 1,000-token pieces are identical to the reference; the tail shorter than 1,000 tokens is dropped). The shipped `fw_counts.json` was trimmed from the previous build with the same counts (numpy was not available to re-run the builder); `tools/build_ch2.py` now writes the trimmed file.

| Item | Source | Shipped |
|---|---|---|
| T-2 (Ted Kaczynski, 1971 essay) | transcription of an FBI document (see `unabom/data/CORPUS_NOTES.md`) | counts per 1,000-word piece (6 pieces); one short quotation |
| U-14 (*Industrial Society and Its Future*, 1995) | typescript transcription | counts per piece (30); one short quotation |
| 19 other writers, 29 texts, 294k words (Mumford, Sale, Zerzan, Glendinning, Mander, Perlman, Illich, Berry, Postman, Goodman, Marcuse, Schumacher, Packard, Toffler, Bookchin, Shepard, Watson, Huxley, Ellul) | The Ted K Archive (AMuseWiki files), still in copyright | **counts only** (282 pieces), author name, title, year, translated flag. No text. |
| Ted's later essays: the 8 "keep" texts of `unabom/data/ted_post_selected.json` (argumentative essays on technology and revolution, 1999-2016) | The Ted K Archive | **counts only** per text, title and year. No text. |
| `totals` | derived | whole-text counts for T-2, U-14 and each of the 19 writers, for the dot strip |

Files: `fw_counts.json` (about 0.2 MB), `excerpts.json` (two short quotations, each at most 60 words, shown with attribution).

**Method** (`lab_ch2.train_and_score`, same as `unabom/scripts/text_level.py`, key `"main"` of `unabom/results/text_level_FW224_1000.json`): FW224 counts on 1,000-word pieces; pipeline `Normalizer(l1)` -> `StandardScaler` -> `LogisticRegression(C=1, class_weight="balanced", max_iter=5000)`; trained on T-2 pieces (1) against all other-writer pieces (0). Other writers' texts are scored held out by whole text in 5 folds (`lab_ch2.group_folds`, the rule of scikit-learn's `GroupKFold`, written out because the Pyodide scikit-learn breaks ties between equal-sized texts differently; groups are named `author/text` as in the reference). A text's score is the mean `decision_function` (log-odds) over its pieces. The alarm line is the 95th percentile of the 29 held-out other-writer text scores.

| Quantity | Reference | Lab (browser) |
|---|---|---|
| Alarm line (log-odds) | -4.77 | -4.77 |
| Other writers' texts over the line | 2 of 29 | 2 of 29 |
| Ted's later essays over the line | 7 of 8 | 7 of 8 |
| Manifesto | over the line (-1.88) | flagged |

Cases 1, 2 and 4 all use the same 224-word list.

## Case 3 · The Lu Xun brothers (`data/ch3/`)

Source: https://github.com/Wang-Haining/the_many_voices (local clone `/Users/haining/Desktop/github/the_many_voices`). Its README: "The corpus is designated to the public domain. All other materials are licensed under 0BSD." So `corpus.json` ships the **full Chinese texts** (31 training pieces, 30 validation pieces, 4 disputed essays) and the **English translations** of the four disputed essays (`translation/`, 0BSD). Built by `tools/build_ch3.py`.

The lab runs a port of `run.py`/`utils.py` (`lab_ch3.py`): same 31 features (27 characters and 4 bigrams), same `count_frequency` (verified on the repo's own docstring example: `[3, 1, 2]`), `StandardScaler` + L2 `LogisticRegression(C=1, tol=1e-9)`. The highlight uses a simplified orange/blue shading (Lu Xun orange, Zhou Zuoren blue) instead of matplotlib's colour maps.

The chapter is written as a 22-step first machine-learning project; `lab_ch3.py` holds its plots (rates of the 31 characters, biggest gaps, two-character scatter, PCA map, S-curve, weights, held-out check, per-essay pushes, verdict). The extra figures it prints are derived from the same model and add no new claims: the two most telling characters (之, 惟, chosen by gap over spread among training pieces), PCA shares (0.32, 0.09), and the score of 望华国篇 as a sum (+0.59 start + 3.51 pushes = +4.10, P = 0.984).

**Chinese font for plots.** Pyodide's matplotlib has no CJK font. `data/ch3/font.json` holds `{"name", "note", "b64"}`: Noto Sans SC (SIL OFL 1.1, licence in `data/ch3/FONT_LICENSE.txt`), instanced at wght 400 and subset to the 31 characters, all corpus titles, the four disputed essays' characters, ASCII and common punctuation (191 KB font, 255 KB as base64; base64 because `app.js` writes chapter data files as text). `lab_ch3.use_font()` decodes it to a temp file and registers it; each plot function runs inside `rc_context`, so other chapters' plots are unaffected. No bold weight is shipped, so the plots use no bold text. Rebuild (fontTools): download `NotoSansSC[wght].ttf`; `f = instancer.instantiateVariableFont(TTFont(src), {"wght": 400})`; `o = subset.Options(); o.hinting = False; o.layout_features = []; o.notdef_outline = True` (also drop DSIG, GPOS, GSUB, GDEF, STAT, BASE, kern); `sub = subset.Subsetter(o); sub.populate(text=T); sub.subset(f)` with T = the 31 characters + every `title` in `corpus.json` + the text of the four `test` essays + printable ASCII + `·→←—…、。，；：？！“”‘’《》（）「」×−±` + 鲁迅周作人; rename the family (name IDs 1, 4, 6) to "Noto Sans SC Lab Subset"; save, base64 the bytes into `font.json`. Source: https://github.com/google/fonts/tree/main/ofl/notosanssc. `data/LICENSES.md` still needs a row for it.

Numbers reproduced, both natively (scikit-learn 1.9) and in the browser (Pyodide, scikit-learn 1.6):

| Quantity | Published (README / paper) | Lab |
|---|---|---|
| Validation accuracy | 0.933 | 0.933 |
| Validation F1 (Lu Xun as positive class) | 0.964 | 0.964 |
| P(Lu Xun), 望华国篇 | 0.984 | 0.984 |
| P(Lu Xun), 望越篇 | 0.856 | 0.856 |
| P(Lu Xun), 尔越人毋忘先民之训 / 民国之征何在 | not in README | 0.833 / 0.595 |

All match. **Two things to know before the lecture:** (1) the validation set is 28 Lu Xun pieces and 2 Zhou Zuoren pieces (confusion matrix `[[1, 1], [1, 27]]`), so accuracy 0.933 equals the "always say Lu Xun" baseline, and F1 0.964 is for the Lu Xun class only (Zhou's F1 is 0.5). The page prints the confusion matrix and the per-brother hits ("27 of 28", "1 of 2") and draws every validation piece with the two misses ringed, but it does not state the baseline comparison. (2) The README's corpus table lists 望越篇 under Validation, but in the repository it sits in `test_*` and is scored with the other disputed essays. The texts are very short (308-750 characters).

## Case 4 · Glassdoor v. Machine Zone (`data/ch4/`, EBG corpus; legacy RJ version in `data/ch4_rj/`)

**The case text.** Glassdoor, Inc. v. Superior Court (Machine Zone, Inc.), 9 Cal. App. 5th 623 (2017); caption GLASSDOOR, INC., Petitioner, v. SUPERIOR COURT OF SANTA CLARA COUNTY, Respondent; MACHINE ZONE, INC., Real Party in Interest (Cal. Ct. App., 6th Dist., Mar. 10, 2017). Facts stated in the lab (from chapter 1 of the book, checked against the opinion): an anonymous review titled "A Scandal" criticized Machine Zone; Machine Zone sued the anonymous poster ("John Doe", described by the court as a former employee) for breach of contract and sought his identity from Glassdoor; the court held Glassdoor could assert its users' rights and directed denial of the motion to compel because the required prima facie showing was missing. The court did not use stylometry; everything after that is labelled "what if" in the page. The real review is not available, so "John Doe" is a stand-in author from EBG. No other case details are stated.

**EBG text (shipped, same origin).** Extended Brennan-Greenstadt corpus, from the PSAL Anonymouth repository, https://github.com/psal/anonymouth/tree/master/jsan_resources/corpora/amt, **AGPL-3.0** (the repository's `COPYRIGHT.txt`: JSAN, JStylo and Anonymouth are copyright 2011-2013 by the Privacy, Security and Automation lab at Drexel University and released under AGPL version 3). So that students never need GitHub, the 793 files are **copied unchanged into `data/ch4/ebg/`** (3.1 MB with the licence files), together with `COPYRIGHT_NOTICE.txt` (a summary of that COPYRIGHT.txt; the original file was not available offline and should be copied in when convenient) and `LICENSE-AGPL-3.0.txt` (the full licence text). `ebg_manifest.json` (built by `tools/build_ch4_ebg.py`) lists the files with size and SHA-256 and records the source commit `7bd8e24b661f587facf8715a1de345dffde9734e` (master head, 2013-10-16); the page loads the files from its own folder and Python checks every hash. The copies were taken from a download made for the earlier version and all 793 hashes match the manifest. (The Drexel-AMT-Corpus folder in the reproduction repository differs in 40 files and was not used.) The page footer credits the source and licence.
Layout: 45 author folders (`aa`, `b`, `bb`, ...). Per author: `<a>_NN_*.txt` pre-existing writing (about 500 words each, about 15 files; 699 files in all), `<a>_obfuscation.txt` (45), `<a>_imitation_NN.txt` (49; 45 authors, a few have two; the lab uses `_01`, and the imitation target is Cormac McCarthy), `<a>_demographics.txt` and `<a>_verification.txt` (9), the last two unused.
Split, copied from the book benchmark (`hlt/experiments/ch07/utils.py`): `<a>_01_1.txt` = the held-out test text ("the review"), the other 654 numbered files = training. So there are 45 authors, 654 training pieces, 45 test texts of 468-508 whitespace words (mean 492). Training words per author with the lab's letters-only tokenizer: mean 7,159 (range 5,849 to 10,927). The setting is the "same-topic, strong attacker" case: train and test come from the same pre-existing writing.
Encoding: the benchmark read files with `chardet`; one test text (`j_01_1.txt`) contains a UTF-8 curly apostrophe that chardet read as cp1252 (mojibake), so the benchmark's LLM rewrites for author `j` were made from the mojibake text. The lab reads UTF-8 (cp1252 only as a fallback). The other 44 test texts match the benchmark's recorded source hashes.

**Attacker** (`lab_ch4.FW224Attacker`): the same as Case 1: counts of the 224 function words (tokens of `[a-z]+(?:'[a-z]+)?` on lower-cased text) -> `Normalizer(l1)` -> `StandardScaler` -> `LogisticRegression(C=1, lbfgs)`, trained on all 654 pieces (45 classes). The earlier second attacker (character 3-grams + SVM) and the mentions of Writeprints and RoBERTa were removed from Case 4. (`FWAttacker` and `Char3Attacker` stay in `lab_ch4.py` only for the legacy `#ch4rj` page.) It is the lab's stand-in, not the book's frozen attackers. Native results, all numbers: `../assets/figs/ch4_fw224_results.json`.

**John Doe** is chosen by a rule, not by hand: among authors whose held-out text the attacker ranks first (21 of 45), sort by the probability given to the true author and take the lower middle one. Result: author `ss` (P = 0.600). The page shows the whole-population table next to him everywhere.

**`rewrites_cache.json`** (1.70 MB) holds real rewrites (the earlier placeholders were replaced). Source (marked in the file and in the page): "Wang (2026) local-LLM benchmark, retained outputs", from Tempest `/home/group/jasonclark/g91p721/hlt/artifacts/` (read-only). The benchmark's final retained set is 18 configurations (excluded: Llama-2-7B, Llama-2-13B, Qwen3-8B) x 4 strategies x (45 EBG + 21 RJ texts) = 4,752 rewrites. Shipped: EBG test texts only, for four small open-weight configurations: meta-llama/Llama-3.1-8B-Instruct, Qwen/Qwen2.5-7B-Instruct, google/gemma-2-9b-it, mistralai/Ministral-8B-Instruct-2410 (all bf16, revisions in the file) = 45 x 4 x 4 = 720 rewrites. Strategies: obfuscation, imitation of Cormac McCarthy, Special English simplification, Chinese round-trip translation (`round_trip_translation` in the benchmark, `backtranslation` in the lab). Keys: `<author>|<strategy>` -> `<config>` -> `{text, sha256, repaired}`; the join to the corpus is by text id `corpora/ebg/<a>/<a>_01_1.txt`. Sampling in the benchmark: temperature 0.7, top-p 1.0, up to 4,096 new tokens, seed 93187.
Verification (done by `tools/tempest_export_ebg_rewrites.py` on Tempest): each rewrite is the source generation record (`ch07_metric_validation_v1/generation_checkpoint.json` -> `generations.jsonl`), or the record in `ch07_retained_models_v1/<idx>/repairs.jsonl` where the retained-model audit regenerated it (6 of the 720: 5 English regenerations, 1 round trip; for each, the repair's recorded original hash equals the audit's hash). All 720 SHA-256 values equal the hashes in the benchmark's content-score records (`ch07_smart_mis_v1/<idx>.jsonl` or `content_updates.jsonl`), the 720 keys are all in `hlt/experiments/ch07/results/pareto_numeric_retained_v1.json`, and the 704 of 720 source-file hashes recorded in the generations match the pinned GitHub files (the other 16 are author `j`, see above).
**Licence:** these are machine rewrites of EBG texts, so they are derived from AGPL-3.0 data and carry the same notice (`_license` in the file). Note that `hlt/planning/PROVENANCE_MAP.md` says raw model outputs are not to be copied into Git; this lab folder is not that repository, but keep the cache out of the `hlt` repository.

Results table of the page (224 words; caught at rank 1 / within top 5 / median rank; "all four models" pools 4 x 45 = 180 rewrites): no defense 21/45, 37/45, 2; human obfuscation 2/45, 10/45, 15; human imitation 2/45, 10/45, 13; obfuscation 43/180, 95/180, 5; imitation 28/180, 82/180, 7; simplification 23/180, 81/180, 7; round trip via Chinese 61/180, 112/180, 3. Human texts are NEW essays, not rewrites of the held-out text, so they are not like-for-like with the LLM rows. Per-model rows are on the page and in `../assets/figs/ch4_fw224_results.json`.

**Page framing (defence project).** Case 4 is written from John Doe's side: baseline attack (21/45), then disguises (human obfuscation, four LLM strategies, the student's own rewrite). Human imitation of McCarthy is no longer on the page (still loaded by `load_ebg`; numbers above unchanged). "Words kept" (`lab_ch4.words_kept`: share of the original's words, with repeats, still in the new text) is the only meaning proxy; the data has no meaning score.

Other files: `prompts.json` (verbatim from `hlt/experiments/ch07/prompts.json`, checked identical; used for the live path and shown on the page).
Legacy RJ version (`#ch4rj`): see the previous notes in `tools/build_ch4_rj.py`. Riddell-Juola corpus, CC0, 20 candidates drawn with seed 0, placeholder rewrites (hand-written, marked `placeholder: true`), `data/ch4_rj/`. It is kept but is no longer the default and has no tab.

## What is NOT shipped

- Eno's translation text (Case 1): counts only.
- Any text by the 19 impostor authors or by Ted's post-arrest writing (Case 2): counts only.
- Nothing else is withheld from Case 4: the EBG corpus and the cached rewrites are shipped under AGPL-3.0 with notice (see above).
- API keys: the proxy holds them as Worker secrets.

