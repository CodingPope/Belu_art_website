import { getPayload } from 'payload'
import config from '@payload-config'

async function seed() {
  const payload = await getPayload({ config: await config })

  console.log('Seeding database...')

  // Create admin user
  try {
    await payload.create({
      collection: 'users',
      data: {
        email: 'belu@belumalu.com',
        password: 'changeme123',
        name: 'Belu Maluenda',
        role: 'admin',
      },
    })
    console.log('Created admin user')
  } catch {
    console.log('Admin user already exists')
  }

  // Seed markets
  const marketsData = [
    { name: 'Abstract Denver', status: 'live' as const, dateInfo: 'Stocked now · all locations', sortOrder: 1 },
    { name: "Spring Maker's Market", status: 'upcoming' as const, location: 'Denver, CO', dateInfo: 'Denver, CO · dates TBA', sortOrder: 2 },
    { name: 'Summer Art Walk', status: 'tba' as const, dateInfo: 'Announced soon', sortOrder: 3 },
  ]
  for (const market of marketsData) {
    await payload.create({ collection: 'markets', data: market })
  }
  console.log('Seeded markets')

  // Seed artworks
  const artworksData = [
    { title: 'Tito on Catnip', slug: 'tito-on-catnip', catalogNumber: 1, medium: 'Acrylic on canvas', dimensions: '16 × 20 in', year: 2024, categories: ['originals', 'cats'] as ('originals' | 'cats')[], availability: 'available' as const, priceDisplay: 'Original available · prints from $40', sortOrder: 1 },
    { title: 'Tito Mandala', slug: 'tito-mandala', catalogNumber: 2, medium: 'Ink + gouache', dimensions: '18 × 18 in', year: 2024, categories: ['mandalas', 'prints', 'cats'] as ('mandalas' | 'prints' | 'cats')[], availability: 'prints-only' as const, priceDisplay: 'Giclée prints from $35', sortOrder: 2 },
    { title: "Don't Worry Be Hoppy", slug: 'dont-worry-be-hoppy', catalogNumber: 3, medium: 'Giclée', dimensions: '8 × 10 in', year: 2023, categories: ['prints'] as ('prints')[], availability: 'prints-only' as const, priceDisplay: 'Prints from $35', sortOrder: 3 },
    { title: 'Morning Joe', slug: 'morning-joe', catalogNumber: 4, medium: 'Acrylic on panel', dimensions: '12 × 16 in', year: 2024, categories: ['originals'] as ('originals')[], availability: 'available' as const, priceDisplay: 'Original available · prints from $40', sortOrder: 4 },
    { title: 'Munchie Max', slug: 'munchie-max', catalogNumber: 5, medium: 'Giclée', dimensions: '11 × 14 in', year: 2023, categories: ['prints', 'cats'] as ('prints' | 'cats')[], availability: 'prints-only' as const, priceDisplay: 'Prints from $35', sortOrder: 5 },
    { title: 'Calle Color', slug: 'calle-color', catalogNumber: 6, medium: 'Acrylic + spray study', dimensions: '', year: 2025, categories: ['originals', 'murals'] as ('originals' | 'murals')[], availability: 'inquiry' as const, priceDisplay: 'Commission inquiry only', sortOrder: 6 },
    { title: 'Sol Mandala', slug: 'sol-mandala', catalogNumber: 7, medium: 'Ink', dimensions: '12 × 12 in', year: 2024, categories: ['mandalas', 'prints'] as ('mandalas' | 'prints')[], availability: 'prints-only' as const, priceDisplay: 'Prints from $35', sortOrder: 7 },
    { title: 'Static Bloom', slug: 'static-bloom', catalogNumber: 8, medium: 'Acrylic study', dimensions: '9 × 12 in', year: 2025, categories: ['originals'] as ('originals')[], availability: 'available' as const, priceDisplay: 'Original available', sortOrder: 8 },
    { title: 'Field Notes', slug: 'field-notes', catalogNumber: 9, medium: 'Risograph', dimensions: '8 × 8 in', year: 2025, categories: ['prints', 'murals'] as ('prints' | 'murals')[], availability: 'prints-only' as const, priceDisplay: 'Prints from $30', sortOrder: 9 },
    { title: 'Siesta', slug: 'siesta', catalogNumber: 10, medium: 'Gouache', dimensions: '10 × 14 in', year: 2024, categories: ['originals', 'cats'] as ('originals' | 'cats')[], availability: 'available' as const, priceDisplay: 'Original available', sortOrder: 10 },
    { title: 'Luna Mandala', slug: 'luna-mandala', catalogNumber: 11, medium: 'Ink + gouache', dimensions: '18 × 18 in', year: 2024, categories: ['mandalas', 'prints'] as ('mandalas' | 'prints')[], availability: 'prints-only' as const, priceDisplay: 'Prints from $35', sortOrder: 11 },
    { title: 'Andes, in passing', slug: 'andes-in-passing', catalogNumber: 12, medium: 'Acrylic study', dimensions: '', year: 2025, categories: ['originals', 'murals'] as ('originals' | 'murals')[], availability: 'available' as const, priceDisplay: 'Original available', sortOrder: 12 },
  ]

  for (const artwork of artworksData) {
    await payload.create({
      collection: 'artworks',
      data: { ...artwork, featured: artwork.catalogNumber === 1, _status: 'published' },
    })
  }
  console.log('Seeded 12 artworks')

  // Lexical rich text helpers
  type LexicalNode = {
    type: string
    version: number
    [key: string]: unknown
  }

  function textNode(text: string, format?: number): LexicalNode {
    return { type: 'text', version: 1, detail: 0, format: format || 0, mode: 'normal', style: '', text }
  }

  function paragraph(...children: LexicalNode[]): LexicalNode {
    return { type: 'paragraph', version: 1, direction: 'ltr', format: '', indent: 0, textFormat: 0, textStyle: '', children }
  }

  function heading(tag: 'h2' | 'h3' | 'h4', ...children: LexicalNode[]): LexicalNode {
    return { type: 'heading', version: 1, direction: 'ltr', format: '', indent: 0, tag, children }
  }

  function richText(...children: LexicalNode[]) {
    return { root: { type: 'root', version: 1, direction: 'ltr', format: '', indent: 0, children } }
  }

  // Seed journal posts — content from belumalu.com/blog
  const postsData = [
    {
      title: 'Things I Learned From Poisoning Myself: Part 1',
      slug: 'poisoning-myself-kambo-part-1',
      categories: ['adventure', 'travel'] as ('adventure' | 'travel')[],
      publishedDate: '2020-04-21',
      excerpt: 'I did my best to breathe deeply and remain calm as I felt the heat of the toxin make its way from the burns in my arm throughout my body.',
      featured: true,
      sortOrder: 1,
      content: richText(
        paragraph(textNode('I did my best to breathe deeply and remain calm as I felt the heat of the toxin make its way from the burns in my arm throughout my body. I broke into a cold sweat and began to shake when it reached my torso.')),
        paragraph(textNode('Minutes later, my eyes were bloodshot, face and neck swollen in Frog Face, as they called it. I felt the two liters of water I had just chugged rumble sickeningly in my stomach. I leaned forward over the bucket in front of me, my elbows shaking as my hands supported my weight on the floor.')),
        paragraph(textNode('Before long, the '), textNode("curandera's", 2), textNode(' melodic singing of the traditional '), textNode('Shipibo', 2), textNode(' ceremonial music contrasted the not-so-harmonious sounds of me vomiting violently into the bucket.')),
        paragraph(textNode('Why am I doing this?', 2), textNode(' I thought. ', 2), textNode('More importantly, why am I willfully doing this for a second time?', 2)),
        paragraph(textNode("Let me say this first. I didn't work with Kambo out of mere curiosity or to check something off of my travel bucket list. I certainly didn't subject my body to one of the world's strongest non-lethal toxins for fun. There was a method to this madness, and I had done my homework.")),
        heading('h2', textNode('Kambo: Probably The LEAST Enjoyable Sacred Medicine')),
        paragraph(textNode("Kambo is a toxin that is harmlessly collected from the Amazonian Kambo frog. It's not the psychedelic stuff thrill-seeking people and monkeys lick off of a very different tree frog species for a trippy good time. Kambo is an excruciatingly uncomfortable, non-psychoactive traditional purgative medicine.")),
        paragraph(textNode("When the body receives the medicine through small burns on the skin, it's shocked into crisis mode (fun fact: if you take it orally your brain will shut down and you'll die). Every bodily system freaks out as it scrambles to push the toxin out in any way it can: sweat, tears, vomit, and maybe a trip to the bathroom. The frog's poison is quickly expelled, along with a flood of other pathogens and toxins. Once the ordeal has finished power-washing the body and brain, the mind is left very, very sharp.")),
        heading('h2', textNode('A Scatterbrain Seeks A Cure')),
        paragraph(textNode('Like many people who live in the US, I suffered from difficulty concentrating that I half-jokingly attributed to undiagnosed attention deficit disorder. I was supposed to be the conductor of my train of thought, but I often felt more like a passenger gazing out the window, along for the ride.')),
        paragraph(textNode("Let me be clear that I don't think attention deficit disorders are made-up ailments. I just think that many people attribute their difficulty concentrating to a mental disorder that requires medication, rather than exploring other factors that could be causing brain fog.")),
        paragraph(textNode('Most people deal with multiple factors that make concentrating difficult, suffering the '), textNode('combined', 1), textNode(' effects of things like insufficient sleep, lack of regular exercise, nutrient-poor diets, frequent alcohol consumption, and overstimulation from the constant consumption of media.')),
        paragraph(textNode("The possible after-effect of a sharpened mind was the reason I had sought out Kambo and subjected myself to the ceremonies. I was in Peru, halfway through my seven-month backpacking trip, and my usual trouble concentrating had worsened. I avoided my travel journal and procrastinated on work, feeling unmotivated by my lack of focus. Writing memories to preserve them and their lessons for my future self has always been a personal priority, so these difficulties really bothered me.")),
        paragraph(textNode('Knowing that the brain\'s potential largely depends on the state of the body, I decided to experiment with resetting my body with Kambo to see how it affected my mind.')),
        paragraph(textNode("The last couple of times I purged into the bucket during the ceremonies, I tasted an acrid, chemical flavor, like I was ridding my body of the contents of a chemistry set. From what I had read, this was the concentrated taste of the additives in lengthy ingredient lists on packaged food, harmful substances in my beauty and hygiene products, and every other toxin my immune system had managed to filter to protect my brain and organs.")),
        heading('h2', textNode('Beyond The Fog')),
        paragraph(textNode('The medicine wore off after about twenty-five minutes. I washed my mouth out with water and collapsed onto a mattress, still shivering. About half an hour later, I thanked the '), textNode('curandera', 2), textNode(' and headed back to my hostel. I felt tired the rest of the day, but otherwise normal.')),
        paragraph(textNode("The next morning, however, I felt the aftereffects of the Kambo even more intensely than I had after the first ceremony. It was the reason I had gone back for round two. My mind was crystal clear, all mental chatter silent. I had laser focus as I worked on articles for my freelance work. More importantly, my personal journal writing flowed freely.")),
        paragraph(textNode("The analogies of the brain being a computer crossed my mind as I felt exhilarating power and consistent control over my own train of thought. I've always believed that the body and brain are the lens through which we perceive the world. I was amazed by how much clearer that lens could be.")),
        paragraph(textNode("Like many things that appear to be magic bullets, I was left with a problem. I couldn't just pop back to the Peruvian Sacred Valley every time I needed to sharpen my mind. I couldn't, wouldn't rely on Kambo or any other external substance to give me this clarity. So how could I sustain this mental state? Clear clues came in the following days. This was the beginning of a transformative process for which the frog medicine had been a mere catalyst.")),
        paragraph(textNode("Did you enjoy reading this piece? If you did and you'd like to hear the rest of the story, please subscribe "), textNode('here', 2), textNode('! '), textNode('Just', 2), textNode(' blog posts, zero spam, I promise!')),
      ),
    },
    {
      title: 'Things I Learned From Poisoning Myself: Part II',
      slug: 'poisoning-myself-kambo-part-2',
      categories: ['adventure', 'travel'] as ('adventure' | 'travel')[],
      publishedDate: '2021-06-04',
      excerpt: 'After my second experience with the Amazonian frog medicine, Kambo, I settled into what would turn out to be a month-long stay in Pisac, a town in the Peruvian Sacred Valley.',
      sortOrder: 2,
      content: richText(
        paragraph(textNode("After my second experience with the Amazonian frog medicine, Kambo, I settled into what would turn out to be a month-long stay in Pisac, a town in the Peruvian Sacred Valley. I was relishing the focus and energy unlocked by the frog's toxin. It had lifted the chemical veil of brain fog I had been squinting through for years.")),
        paragraph(textNode('Although I was satisfied with the results of the medicine, I soon found that I had underestimated its after-effects. My mind was not the only thing about me that was altered. I first noticed the second side effect while walking through the streets of Cuzco the morning after my first ceremony.')),
        paragraph(textNode('I was on my way to the market when I passed by a street food vendor selling xurros, a fried pastry that, when fresh, is a delicious roundhouse kick to the arteries. I was surprised to find that the normally heavenly aroma of the treats disgusted me.')),
        paragraph(textNode("Later, while going for lunch in the market, I wrinkled my nose at the smells that emanated from cooking meats, bakeries, and fried foods. They did nothing to stir my appetite. It's not that I usually gravitate toward these foods in particular, but don't things like freshly baked bread usually smell appetizing regardless of one's dietary habits?")),
        paragraph(textNode("Oddly enough, I discovered that my cravings had gone in an unexpected direction when I meandered into the fruit section. I stopped at a stall selling persimmons. I'd always enjoyed eating the juicy, sweet fruit straight off of the tree on my grandparents' farm in Chile, but that moment, my mouth watered at the sight of them as if I hadn't eaten in days.")),
        paragraph(textNode("That was how I realized that I craved fruit and vegetables like a kid craves sugar. My body begged for plants! Those first days after my two Kambo ceremonies, I consumed huge quantities of fruit, vegetables, and nuts, readily available in the markets and well-suited to my backpacker's budget.")),
        heading('h2', textNode('A Chemical Change In My Appetite')),
        paragraph(textNode("Though I've been somewhat health-conscious with my nutrition for years, I've never been one to go on diets. I always scoffed at the idea of willfully depriving myself of culinary delights. Still, I welcomed my new cravings since I didn't miss processed foods. I was incredibly curious as to why my body now asked for plants like it used to ask for chocolate.")),
        paragraph(textNode("My research explained that in addition to ridding my body of harmful synthetic toxins, the frog medicine had also cleaned out the buildup of substances that make me crave things like refined sugar, fried foods, dairy products, meats, and pastries. After all, these foods are mild addictions that have been incorporated into human diets over time: but they are not ideal for our lengthy digestive tracks and ape-like metabolisms.")),
        paragraph(textNode("After Kambo, I was like an ex-smoker whose body has totally eliminated trace amounts of nicotine. My brain had no chemical 'memory' of these foods, so it didn't know to ask for them. I learned that many detoxes can deliver the same effect over time, but my sudden disgust was caused by the abrupt way these substances had been expelled from my system.")),
        paragraph(textNode('The only thing that would drive me back to eating these less-than-healthy treats was the knowledge that a freshly made, dulce-de-leche-filled xurro would probably still taste like a bite out of heaven when I had one again (it did).')),
        paragraph(textNode("My new dietary impulses offered a major clue as to how I could draw out the benefits of the Kambo. I reasoned that my mind had sharpened because the unhealthy substances that the Kambo had eliminated used to create a foggy film over the lens of my perception, making it difficult to focus my attention. I was curious about some of the biggest culprits for that mental fog. A little research revealed that meat was one of the biggest dietary contributors to brain fog and lack of energy— which gave me an idea.")),
        heading('h2', textNode('Vegetarianism: An Experiment')),
        paragraph(textNode("Soon after working with Kambo, I decided to try out a vegetarian diet. No better time to test it out than now, as the aroma of crispy Peruvian roasted chicken I smelled everywhere couldn't tempt me!")),
        paragraph(textNode("The change in my diet was not an attempt to lose weight or to strive for perfect, all-natural nutrition. It was experiment. The knowledge that well-balanced vegetarian diets are healthy was never a strong enough motivator to actually make me give up meats. I'm Chilean, after all: asados of grass-fed beef cooked slowly over a wood fire are the ceremony and sacrament of Chilean culture. I had always loved all sorts of meat, poultry, and seafood. However, seeing the changes the Kambo made in my mind made me irresistibly curious to investigate what else I could do to naturally boost my baseline potential. I was especially interested in finding out if, and to what degree the carnivorous elements of my diet contributed to the lack of focus I had experienced my whole life.")),
        paragraph(textNode("For the next month, I cooked at the hostel and ate at the sole vegetarian food stall in the Pisac market. I touted the stall's savory vegetarian dishes to anyone who would listen. The sweet cook took to smiling broadly at me every time I arrived with ever-growing groups of her fans, and sometimes gave me extra helpings of her fantastic lentils.")),
        paragraph(textNode("With every day that passed, I felt the effects of the cleanse intensify. Just a few days after starting the vegetarian diet, I felt lighter, and my skin had a clean, healthy glow. I slept more deeply, had more vivid dreams, and never needed naps— not even after morning hikes. From the moment my eyes sprang open in the morning, my energy felt boundless. I stopped needing coffee, a pleasure that had turned into a compulsive addiction with the rigors of school years before. Higher quality fuel had made for a faster car.")),
        heading('h2', textNode('Lessons From The Frog')),
        paragraph(textNode("The Kambo and vegetarian diet gave me unprecedented insight into the effects of certain substances on my mind, energy levels, and body. The temporary absence of cravings taught me about my relationship to food. I began to see the degree to which I consumed things without the intention of actually providing my body nutrition. The changes I felt revealed that a more conscious, disciplined, and healthy relationship to food was the key to eliminating many physical and mental obstacles that I had come to accept as facts of life.")),
        paragraph(textNode("After I left the Sacred Valley and reached Lima and its world-renown seafood (I LOVE ceviche), I switched to a pescatarian diet, which simply added seafood to my otherwise vegetarian meals. I saw the effects of the cleanse only slightly reduced.")),
        paragraph(textNode('It was there, in Lima, that I discovered the final benefit of my cleanse. It was the most powerful, impactful, and unexpected of all.')),
      ),
    },
    {
      title: 'Things I Learned From Poisoning Myself: Part III',
      slug: 'poisoning-myself-kambo-part-3',
      categories: ['adventure', 'travel'] as ('adventure' | 'travel')[],
      publishedDate: '2021-05-04',
      excerpt: 'The small burns on my inner left arm and right wrist had taken on a more even color and texture. It had been almost a month since I had worked with the Amazonian frog poison.',
      sortOrder: 3,
      content: richText(
        paragraph(textNode("The small burns on my inner left arm and right wrist had taken on a more even color and texture. It had been almost a month since I had worked with the Amazonian frog poison—a month during which I had relished the clear mind and boundless energy the powerful cleanse had given me access to.")),
        paragraph(textNode("Working with the frog toxin had been an invaluable learning experience. Its side effects helped me develop a more conscious relationship to food, which in turn helped me extend and maintain the toxin's energy-boosting and mind-sharpening benefits. These benefits made me decide to maintain the mostly pescatarian diet I had been experimenting with. Improving my nutrition permanently upgraded the capabilities of my body and mind, opening the door to further development.")),
        paragraph(textNode('I thought I had learned all I could from Kambo, so I mostly considered my experience with that sacred medicine to be in the past by the time I arrived in Lima. I never suspected that the frog had one last gift in store for me. I discovered the most wonderful and life-altering side effect of my Kambo ceremonies with a little help from a uniquely colorful character.')),
        heading('h2', textNode('Guiding Wisdom From An Odd Mentor')),
        paragraph(textNode("I met Loko Pe—a fellow Chilean—the day I arrived in Peru's massive, ever-cloudy capital city. 'Loko' is a stylized spelling of 'loco' meaning crazy, and 'Pe' is short for 'Pancho,' a common moniker for the name 'Francisco'. South Americans have quite a thing for nicknames.")),
        paragraph(textNode("That nickname, hand-painted t-shirts, ever-present Rasta beanie, and chilled-out demeanor suggest a proclivity for smoking large quantities of the devil's lettuce. The stoner vibe is deceptive, however. Under the beanie draped over long, curly black hair is one of the most highly intelligent, intuitive, and exuberantly creative minds I've ever had the good fortune of befriending.")),
        paragraph(textNode("A prolific muralist and musician, Loko Pe is always bursting with ideas and insights. In the time I was in Lima, he became a sort of creative mentor as well as a dear friend. I had been hanging out with him for a few days when I showed him some photos of my art.")),
        paragraph(textNode('"Chiiika, eres artista," you\'re an artist, he said. "Tení que darle no ma," you\'ve just got to give it your all," he told me in his homey Chilean accent. Loko encouraged me to pour myself into my art and let go of my paralyzing anxieties over my lack of practice and other people\'s opinions. He suggested I try to paint a mural at La Red Cervecera, the Chilean brewery where he worked as an event manager. I loved the idea that a mural I painted could bring a little more color into a space meant for laughter, music, and interpersonal connection, not to mention particularly tasty craft beer.')),
        heading('h2', textNode('The Mural: Rediscovering A Passion')),
        paragraph(textNode("When I first started designing the mural, I was really neurotic about getting everything with the design just right. I'd always liked working with tiny paintbrushes whose lines are no thicker than a pencil's, and I avoided large canvases. A mural offered so much space on which I could mess up! A failure would be particularly public and permanent on the designated wall at the entrance of the brewery.")),
        paragraph(textNode('Loko Pe pointed out the ridiculousness of my stress. This was painting. I liked painting. This was supposed to be fun. Why was I stressing about it like it was my university thesis? Loko helped me relax and begin to have fun with the piece, making a big impact on my mentality throughout the whole process.')),
        paragraph(textNode("My design depicted a bud of hops, which are plants used in the brewing process of most beers. With Loko Pe's introduction, I presented my technicolor rendition to the brewery owners. They liked my design, and I got to work quickly. As I began to paint, I felt something I'm not sure I'd ever felt before while creating.")),
        paragraph(textNode('With my newly cleared mind and increased energy, I was able to focus and lose myself in what I was doing for several hours at a time. My mind totally melted into the pleasure of watching the image in my head take shape on the wall before me. In every brushstroke, I found profound comfort, peace, and happiness. It was an elating creative flow that felt incredibly natural and that I\'d never experienced with such intensity.')),
        paragraph(textNode("In this blissful creative state, I received the Kambo's final gift. It was a realization that hit me like a lightning strike, that these were the activities I had so enjoyed as a child but had neglected in adulthood. For years, school and then work had demanded all of my focus and energy. Stress and exertion had stifled my creativity, almost killing it. I realized that painting and similar creative projects were my favorite parts of my nature. They were kind of things to which I should be dedicating much more of myself and my time because they made me happy. How had I not realized it before?")),
        paragraph(textNode("It was then, with Loko Pe's encouragement, that I took my first steps toward breaking down some of the self-created mental barriers that kept me from creating freely. I started by creating an Instagram and a Facebook account dedicated to sharing my creative pieces. I promised myself that I would pursue creative endeavors with more zeal and less self-consciousness.")),
        paragraph(textNode('I was determined to afford creativity a place in my life that held as much weight as activities revolving around work and health. I vowed to carry on these and other the lessons I learned on my trip when I returned to normal life.')),
        heading('h2', textNode('Bumps On The Road')),
        paragraph(textNode("For all the revelations and internally proclaimed commitments, I did NOT apply that new creativity-centric perspective when I returned to Chile after my seven months of travel. I tried for a while, but I had a rather rough series of unfortunate events that derailed my efforts.")),
        paragraph(textNode("It was only after Chile's nationwide eruption of social unrest, a subsequent identity crisis, a bout of depression rooted in subconsciously self-imposed isolation, a scam that emptied my bank account, an acutely painful breakup, and a global pandemic that I was pushed to reevaluate the lessons I'd been gifted on my backpacking trip. It's funny how life tends to dole out merciless slaps of reality when you ignore its signs.")),
        paragraph(textNode('In quarantine, I reflected more deeply on everything that had happened to me not just since my return to South America, but in the past few years of my life. The ruminations turned into a mental maelstrom that made me turn to my journals for relief. After a few days of daily writing, my words began to flow freely. I filled up over a hundred pages in the first three weeks of social distancing. It was then that I decided to face my fears and start a blog.')),
        paragraph(textNode("I've always wanted to share my writing along with my artwork, but of course, I've created mental obstacles for myself. It's so difficult to not fall into the traps of saying, \"I'll wait until it's perfect,\" or \"I'll wait until I've mastered the medium,\" and the most dangerous of all, \"I'll work on it when I feel more inspired.\"")),
        paragraph(textNode("These thoughts postpone getting started. I realize now that I've always been subconsciously terrified of putting pieces of myself out there, exposing them to potential criticism or ridicule. After all, the things I intend to share are images, ideas, stories, lessons learned, and reflections that are fleshed-out excerpts from my personal journals, my innermost self.")),
        paragraph(textNode("I simply like the idea of sharing the things that I've found interesting, beautiful, instructive, useful, and that have piqued my curiosity. My wish is that they provide a little joy, entertainment, or food for thought for a few others. I'll do my best to share with those people in mind and work through my insecurities about the rest. I realize I should anticipate bumps and bruises, but hopefully I'll learn and improve along the way.")),
        paragraph(textNode("I hope you're enjoying my little labor of love! It's been a huge pleasure to put my creative writing out there for you guys and I've loved hearing everyone's feedback and comments so far.")),
      ),
    },
    {
      title: 'It All Began With James Bond: My Love Affair With Cinema – Pt 1',
      slug: 'my-love-affair-with-cinema-part-1',
      categories: ['essays', 'travel'] as ('essays' | 'travel')[],
      publishedDate: '2021-05-04',
      excerpt: 'I can remember the day in which I fell in love with movies. Little five-year-old me wandered into my parents\' room, where my dad was watching something by himself.',
      sortOrder: 4,
      content: richText(
        paragraph(textNode("I can remember the day in which I fell in love with movies. Little five-year-old me wandered into my parents' room, where my dad was watching something by himself. Curious, I looked at the screen and saw a man climbing into a bright yellow helicopter not much bigger than a motorcycle. Interest piqued.")),
        paragraph(textNode('"Papa, que estas viendo?" what are you watching, I asked. My dad knew he wouldn\'t get anywhere explaining to me who James Bond was. Instead, in an ingenious burst of daddish wit, he explained that the movie was essentially about a really cool guy who had to defeat an evil bald guy who lived inside a volcano. I was riveted.')),
        paragraph(textNode('It was there, curled up next to my dad, that I watched You Only Live Twice, my first Bond film. The real-world exotic locations, the action, the car chases, the gadgets: it was unlike anything I had ever seen in my usual animated Disney fare. My little-girl-eyes were awestruck and begged to see more.')),
        heading('h2', textNode('A Gateway Drug')),
        paragraph(textNode('James Bond became my childhood obsession. As my grade school friends can attest, I drew the double-O-seven logo everywhere and found ways to craft it into most school art projects. In middle school, my most prized possession was a replica of the Vesper Lynd necklace from Casino Royale, a birthday present from my parents.')),
        paragraph(textNode("My dad reveled in and nurtured my odd obsession with the suave secret agent. Our weekly Bond marathons became the crux of our relationship. Sometimes joined by my older sister, we escaped into our basement to blast the booming car chases and fight scenes far from my mother's particularly sensitive ears.")),
        paragraph(textNode("But James Bond was just the gateway drug for my movie obsession. When my sister began to argue for something different and I developed the infuriating habit of quoting Bond's witty one-liners as he said them, my dad introduced us to other cinema classics. He began with The Goonies, Raiders of the Lost Ark, and The Fifth Element. Once our childish attention spans grew a little less erratic, he showed us more mature films like John Wayne's The Searchers and Alfred Hitchcock's The Rear Window. I was enraptured by them all.")),
        heading('h2', textNode('Living Vicariously Through Movies')),
        paragraph(textNode("As a kid, I loved movies for their colorful depictions of the magical, the impossible, and the improbable. They provided thrilling visual fodder for my overactive imagination. I became a warrior like Mulan, a treasure-hunting adventurer like Indiana Jones, and of course, a resourceful secret agent that my father nicknamed 'Jamie Bonina.'")),
        paragraph(textNode("I think my love of film, similar to my love of books, was born out of my desire to escape. I was not escaping a difficult or uncomfortable life. Other than the occasional pangs of homesickness for Chile, and the usual emotional growing pains of childhood such as sibling rivalry, I was a very happy kid. I didn't want to escape my reality: I just wished to escape the mundane restrictions of being a kid.")),
        paragraph(textNode("The dreams of adventure that I've been able to pursue as an adult were already intensely present, but of course, mostly frustrated in my childhood. Too young to blaze my own trail, movies satisfied my need to perceive the magic and excitement that I knew existed, but that I had never seen, or perhaps hadn't yet learned to identify in my daily life. This was the essence of my fascination with film until one movie pushed my cinephilia to a whole new level.")),
        heading('h2', textNode('Obsession Becomes Vocation')),
        paragraph(textNode("It was 2009, and my dad took my sister and I to see James Cameron's Avatar in 3-D. I felt so immersed in Pandora's alien paradise, that my eyes filled with tears that fogged up my 3-D glasses. The vivid, almost touchable detail made me feel like I had stepped into the fantasy dreamscape. I could almost reach out and touch the ethereal, luminescent plants of Pandora's nocturnal jungle. My stomach dropped with an exhilarating twinge of vertigo as I soared over the otherworldly landscape, riding on one of the pterodactyl-like creatures. That very day, I decided to study film.")),
        paragraph(textNode("I wanted to learn everything about the world, history, and mechanics behind these captivating, encapsulated dreams. After watching Avatar, it became my vocation to watch the classics and to cross titles off of my ever-growing list of must-sees. I was preparing for my time in university, when I would be able to certify my devotion with a degree. I wasn't sure what I wanted to make of my love of film career-wise. I only knew that I wished to be part of the world that produced the engrossing films which had always gratified my most curious and adventurous inclinations.")),
        paragraph(textNode("Years later, I dove headfirst into my university film studies, determined to figure out the role that cinema would play in my future life. I never expected that as I began to study film as an art form, my cinephilia would deepen, expand, and then radically change form. I also didn't expect for my passion to find its rival in my newfound fascination with the power of strategic communications.")),
        paragraph(textNode("For two years, I was torn between devoting myself to the arts of message development, and my lifelong adoration of cinema. It all came to a head when I got accepted into a study abroad film program in Scotland.")),
        paragraph(textNode("I was prepared for a marvelous semester of all film classes and the chance to travel abroad on my own for the first time. I was not prepared, however, for how that rip-roaring experience would radically shift my perspective not just on film, but also on the unexplored parts of my nature that made me fall in love with cinema in the first place…")),
      ),
    },
    {
      title: 'My Love Affair With Cinema – Pt 2',
      slug: 'my-love-affair-with-cinema-part-2',
      categories: ['essays'] as ('essays')[],
      publishedDate: '2021-05-04',
      excerpt: 'Growing up, my childhood James Bond mania snowballed into a full-blown obsession with cinema.',
      sortOrder: 5,
      content: richText(
        paragraph(textNode('Growing up, my childhood James Bond mania snowballed into a full-blown obsession with cinema. For years, I dedicated myself to devouring films from my watch list, nurturing my passion fanatically.')),
        paragraph(textNode("When I finally had the chance to study cinema in-depth in university, I felt that I was following my childhood dreams by turning my passion into a tangible part of my identity. I would get a degree in film then find some film-centric career. Cinema, this magical, perfect art, would define me. Somehow.")),
        paragraph(textNode("However, two years into college and halfway through my film theory major, I began to have an anxiety-inducing realization: my ardent passion for movies, which had been my life's compass, had begun to cool. Ironically, this occurred when I left for a film-focused study abroad semester in Scotland.")),
        heading('h2', textNode('An Overshadowing Interest')),
        paragraph(textNode("Studying abroad was the first time I had the opportunity to explore strange new places on my own and on my own terms. I left for Europe a few weeks before the start of the semester to backpack a little, attend a couple of festivals, and to meet up with a golden-hearted Scot I had befriended while he was an exchange student at my university. Setting out to immerse myself in different cultures and making new friends abroad was thrilling and deeply satisfying, but it left me feeling confused.")),
        paragraph(textNode("My new enthusiasm for travel had begun to eclipse my love for cinema. When I settled into my studies at the University of Stirling, I realized that I no longer craved movies as I had all my life. After being able to set off on my own solo adventures, I realized that part of what obsessed me with cinema was that it had always satisfied my yearning for the excitement and adventure that I was now free to pursue in real life.")),
        paragraph(textNode("After my first month in Scotland, I began to grapple with the distressing realization that I was no longer sure I wanted to make film my career. The worst part was that I felt that not pursuing film would be a betrayal of my childhood dreams. Now here I was, halfway around the world, with a curriculum totally devoted to preparing me for a future I was no longer sure I wanted. Oddly enough, the thing that helped me reconcile these disorienting shifts came from my rather unglamorous new living situation.")),
        heading('h2', textNode('New Faces And Tight Spaces')),
        paragraph(textNode("The study abroad dorms took a little getting used to. Most of the foreign exchange students were put into shared flats, each with around a half dozen people from different countries. We all quickly grew accustomed to the thin plywood walls, puny kitchens, shared mini fridges, and persnickety smoke detectors that screeched at the slightest wisp of steam.")),
        paragraph(textNode("It was all part of the adventure, part of the novelty of leaving our respective realities to spend a college semester learning, exploring, and struggling to keep up with our lively hosts in Scotland. We bonded through rousing nights out that began with sardine tin bus rides to the local bars and ended with liquor-addled pilgrimages to the chippies. These fast food joints stayed open until the wee hours of the morning to feed the ravenous, dilapidated creatures that wobbled out of the closing venues.")),
        paragraph(textNode("The tight spaces and nighttime revelries certainly did a lot to break the ice between the foreign exchange students. But a more low-key group activity that bonded us left a mark on me as I grappled with my little vocational identity crisis.")),
        heading('h2', textNode('Gathering Around Encapsulated Dreams')),
        paragraph(textNode("At the suggestion of yours truly, my flat mates and I all pitched in and bought a small projector for our living room. Our flat's small common area became the dorm's hub for lazy movie nights and weekend morning recoveries.")),
        paragraph(textNode("The first time we gathered around the projector, I was struck by the magic of the moment. We were a varied group of personalities, all with vastly different backgrounds, cultures, and life experiences. Yet as we scrunched together on the blue-vinyl-cushioned seats and on blankets spread out on the floor, we were united in the shared experience of these riveting, encapsulated dreams.")),
        paragraph(textNode("I was reminded of the father-daughter film marathons with which I first began to appreciate the magic of cinema as a child. I had always loved that we could escape together into other times and other worlds, love and hate the same heroes and villains, and laugh and cry over the same jokes and tragedies. Making this connection as I sat in those dorm movie nights made me realize that this was the real magic of cinema.")),
        heading('h2', textNode('Changing My Relationship To Film')),
        paragraph(textNode("I learned that artful cinematography, captivating performances, and intriguing scripts don't just form vehicles through which we can escape the mundane aspects of reality. Rather, films are timeless, sharable, and uniquely accessible works of art that offer people the bridge of a shared experience regardless of who, when, or where they are.")),
        paragraph(textNode("With this insight, I began to understand that I didn't need to make film my career to involve myself in the magic that movies made me feel. I ruminated on these revelations during the rest of my study abroad semester and during my subsequent solo backpacking trip.")),
        paragraph(textNode("As my adventures yielded new discoveries about unexplored facets of myself, I began to understand that identities are fluid. Our perspectives shift as we continuously discover new passions and interests. Over time, things that once captivated us can become less significant. Because of this, it's not a good idea to base our sense of self on external fancies as we try to understand and develop our identities.")),
        paragraph(textNode("This change in perspective helped me decide to make Film Studies a minor instead of my major. I had feared the decision would feel like a betrayal of my childhood self. But I realized that it would be a bigger betrayal of my future self to cling onto cinema just because it had once been my primary passion.")),
        paragraph(textNode("I'm still enamored by cinema, but I've stopped trying to live through it. I've stopped using it to construct my identity or make it a lens through which I understand who I am. I've learned to love movies for what they can make me feel, how they can help us understand each other, and how they can bring people together.")),
      ),
    },
    {
      title: "How You're Already A Cyborg",
      slug: 'how-youre-already-a-cyborg',
      categories: ['essays'] as ('essays')[],
      publishedDate: '2021-05-04',
      excerpt: 'As the civilized world has come to a grinding halt, most of us have found ourselves yanked out of our daily routines and been handed the double-edged sword of free time.',
      sortOrder: 6,
      content: richText(
        paragraph(textNode("As the civilized world has come to a grinding halt, most of us have found ourselves yanked out of our daily routines and been handed the double-edged sword of free time.")),
        paragraph(textNode("In the monotony of self-isolation, I've revisited an old mind-bending idea concerning the things we have at our disposal to keep us productive, connected, and/or entertained. The idea first came during a college philosophy lecture in which the lecturer talked us through a thought experiment by philosopher David Chalmers.")),
        paragraph(textNode("The experiment involved a man and a woman who are both told to go to an address at a certain day and time. The man writes down the time of the appointment and the address in a notebook, while the woman simply memorizes the information.")),
        paragraph(textNode("When the time comes, both the man and the woman arrive at the correct address at the right time. So, the question is: what's the difference between the two methods of information storage and delivery if both lead to the same desired outcome?")),
        paragraph(textNode("Now, for the more interesting part of this idea and how it relates to you: switch the man's notebook for any smart device. With a smart device, the moment in which you have a question or need instructions of some sort, you can ask a search engine. You can also use tools like a calculator, a map, note-taking apps, a flashlight, and of course, a phone. During the time when you have access to your smart device, it becomes a functional extension of your mind, of yourself. In other words, you're a cyborg.")),
        heading('h3', textNode("Before You Think I've Lost My Marbles…")),
        paragraph(textNode('A cyborg is defined as "a person whose physiological functioning is aided by or dependent upon a mechanical or electronic device." The device doesn\'t necessarily have to be surgically grafted into our physical bodies (though technology is certainly moving toward that). Your brain and smart devices can be thought of as different tools used to complete similar tasks, and smart devices can expand your natural capabilities.')),
        paragraph(textNode("Yes, there is longer lag of time when retrieving information using a phone than there is when you simply remember it. We have to pick up and unlock the phone, wait for things to load, etcetera. Nevertheless, you still get the information when you need it, giving you the same outcome.")),
        paragraph(textNode("It's true, a device can run out of battery, be lost, broken, or stolen. Still, charging it enough to use it takes minutes, and replacing it usually never takes more than a few days. Generally speaking, most people who have smart devices can access them 24/7.")),
        paragraph(textNode('Devices have advantages that brains don\'t. They do not forget. They are not subject to the ever-thickening fog that time layers over our memories. A device will never be drowsy, anxious, unfocused, or drunk. If it is in good condition, has an internet connection, and is charged, its ability to retrieve and relay information from seemingly infinite sources will never be impaired.')),
        heading('h3', textNode("So, I'm A Cyborg. Now What?")),
        paragraph(textNode("If you choose to believe that —to some degree— you are a cyborg, how can you mindfully use that superpower? Because it is a superpower. If a person in the past had a tool that let them instantly access a massive chunk of all human knowledge among other tools, wouldn't they be regarded some sort of sorcerer?")),
        paragraph(textNode("These tools have given us abilities that used to only exist in fantasy and science fiction. For example, geographic distance has been nullified. Today, anybody can instantaneously interact and share with people all over the world with different cultures, perspectives, languages, and backgrounds.")),
        paragraph(textNode("With the internet, knowledge has never been more accessible. I remember when getting an education from an online university was somewhat looked down upon. With the pandemic however, even the world's most prestigious universities are turning to online classes as their standard platform. I'm curious to see if this kind of change makes more people realize that in a few areas such as education, structural and socioeconomic limitations are imaginary if we have the time and desire to educate ourselves using the technological tools we have at our disposal.")),
        paragraph(textNode("Of course, I believe that we must be careful to nurture and develop our spirituality, our bodies, and our interpersonal relationships offscreen and offline. But think of how different our world would be if people had healthier relationships to their tech, if more people used devices as tools rather than as toys.")),
        paragraph(textNode("After all, technological advancements were imagined as things that would make our lives easier. Progress was supposed to provide gadgets that would expand our potential and free up time. We hold the wisdom of the ages in the palms of our hands. We have libraries of knowledge that, more versatile than books, could have us standing on the shoulders of giants if we chose to make the climb.")),
        paragraph(textNode("And yet, so many of us dedicate hours to the leisurely daily perusal of videos and memes. How difficult it is to remind ourselves of the power we hold, when our personalized streaming service queues and infinite social media feeds faithfully oblige us with never-ending distraction.")),
        paragraph(textNode("By being mindful of our relationship to technology, we can wield its power. If we can manage to use devices as constructive tools rather than as addictive drugs, they can be our wings instead of our shackles.")),
      ),
    },
    {
      title: 'Lunch With A Bolivian Cholita: A Lesson On Subconscious Prejudice',
      slug: 'lunch-with-a-bolivian-cholita',
      categories: ['adventure', 'travel'] as ('adventure' | 'travel')[],
      publishedDate: '2021-05-04',
      excerpt: 'I gazed out of the taxi van window at the passing landscape: ancient Incan terraces descended like enormous staircases into the gleaming waters of Lake Titicaca.',
      sortOrder: 7,
      content: richText(
        paragraph(textNode("I gazed out of the taxi van window at the passing landscape: ancient Incan terraces descended like enormous staircases into the gleaming waters of Lake Titicaca. Several cholitas, indigenous ladies dressed in the traditional Bolivian attire, sat in the seats in front of me. The two black braids that fell from each of their bowler hats followed the movement of their heads as they chattered amongst themselves. They spoke in Quechua, the ancient language of the Incan empire. I listened absently to their unintelligible conversation, soothed by their matronly voices as I watched the countryside roll by.")),
        paragraph(textNode("I was headed to the village of Yampupata, from where I would begin a 17-kilometer day hike through the countryside. I was looking forward to my nature day, planned in an effort to hit reset on my unpleasant experience in Bolivia before I left for Peru. I never imagined that I would soon befriend one of the indigenous cholitas in my taxi van, and that she would radically change my view of Bolivia.")),
        heading('h3', textNode('A Hopelessly Negative First Impression')),
        paragraph(textNode("I was hoping to salvage my negative experience in Bolivia, which had begun in the city of La Paz. The city had left me with an abysmal image of the country and its people. When I'd arrived, I had been solo backpacking for about three months, yet it was the first time I felt unsafe and uncomfortably aware that I was a woman traveling alone. When I passed locals in the street, many women regarded me with distrust or scorn, while male gazes were condescending or blatantly predatory. Some ignored me altogether, such as multiple street vendors who preferred to lose out on a sale rather than interact with me.")),
        paragraph(textNode('A few backpackers I\'d met had warned me about the frosty treatment I might experience from Bolivians, particularly Bolivian men. "They don\'t like foreigners," a fellow solo female backpacker had told me. "The only people that won\'t treat you like crap are the ones selling souvenirs. Those see us as walking ATM machines." I took the scathing reviews with a grain of salt, but I was prepared for a little hostility. I never imagined the extent of the local people\'s unfriendliness, which made me feel like an intruder instead of a visitor.')),
        paragraph(textNode("My experience led me to cut several destinations out of my itinerary, but I was determined to visit Lake Titicaca and Isla del Sol, the Island of the Sun, before I left for Peru. Lake Titicaca was one of the crown jewels of my travel itinerary: the mythical birthplace of the Incas. I was reminded of its lore as I gazed out of the taxi van widow at the lake's tranquil waters, which stretched as far as the eye could see. Viracocha, the Incan creator god, was said to have first emerged from its depths to create the sun, moon, and stars.")),
        heading('h3', textNode('An Unusual Acquaintance')),
        paragraph(textNode("After waiting for the remaining cholitas to exit the taxi van at our last stop, I clambered out and looked around. The tiny village that bordered the lake seemed frozen in time. The hilly landscape was dominated by ancient agricultural terraces, some of which were still in use. Donkeys grazed in the uneven patchwork of fields, and villagers in vibrant clothing stood out against the earth tones of the countryside as they worked the land.")),
        paragraph(textNode("I was getting ready to set off on my hike when I noticed one of the cholitas from the van. Though her black bowler hat made her seem taller, she was a little over 5 feet in height and appeared to be in her late 50s. Despite the warm, cloudless day, she wore a wool sweater along with her traditional full, patterned skirt. Sweat beaded on her brow and her dark features reddened as she carried a heavy bundle to a passenger boat at the water's edge. She had several more bundles, each wrapped in handwoven fabrics and filled with bottles of soda, packaged snack food, and other merchandise. I walked over and picked up one of the bundles, following the cholita to the boat.")),
        paragraph(textNode('As she put down her bundle and turned to go back for more, she noticed me for the first time. Her small, almond-shaped eyes were wide with surprise below her faint eyebrows. "Ay! Gracias!" she exclaimed as I set my bundle down. I smiled and told her it was no bother. She continued to thank me profusely as I helped her load the rest of her cargo onto the boat. I was somewhat saddened by her astonishment. Had she grown accustomed to cold indifference from tourists, as I had come to expect animosity from the locals?')),
        paragraph(textNode('When the last bundle was on board, I bade her good day and stepped off of the boat. "Espere," wait, she said. She rummaged in one of the bundles and pulled out a clementine. "Muchas gracias por su ayuda," she said, handing me the clementine. I thanked her as I took the gift from her outstretched hand and turned to go. "Espere!" she said again, more excitedly this time. "Venga conmigo! Venga a almorzar a mi casa en Isla del Sol!" I was silent for a moment, incredulous. Have lunch with her? At her house? On the island? Was she serious?')),
        paragraph(textNode("Her kindness was a sharp contrast to the unfriendly treatment I had come to expect from Bolivians. I had given up on trying to connect with the local people, using my presumption of their hostility as a shield against further disappointment. I forgot my little coping mechanism as I looked into the woman's dark eyes: they shone with friendly warmth, not disapproval. I decided I could hike some other day.")),
        heading('h3', textNode('A Thought-Provoking Exchange')),
        paragraph(textNode("We boarded the small passenger boat and chatted as the boatman pushed off toward the island. The cholita's name was Doña Justina, and she seemed as keen to answer my questions as I was to ask them. We mainly talked about Isla del Sol's legends, and she pointed out ruins and landmarks on the shoreline as we passed them.")),
        paragraph(textNode("Before long, the passenger boat reached a small dock on the island. We took a break to enjoy a couple of popsicles before Doña Justina went to fetch her donkey. It took us several minutes to lash the hefty makeshift bags onto the faithful donkey's back. Once everything was finally secure, the three of us made our way up a steep stone stairway that led from the lakeside to her house in the village of Yumani.")),
        paragraph(textNode('Doña Justina lived on her own in a neat two-story brick house with a shop on the first floor. Once we\'d unloaded the merchandise and set the donkey loose in her garden, Doña Justina asked, "Te gusta el arroz con huevo?" I replied that I loved eggs and rice, and she scurried to her kitchen to prepare lunch.')),
        paragraph(textNode("Before long, the two of us sat down to for our meal of savory vegetable soup, rice, eggs, and coca tea. We ate slowly, chatting over our food. She told me about her late husband, with whom she had built the house, raised four children, and run the little convenience store before he passed away. Her voice was wistful as she spoke of him, and I could tell that despite the years that had passed, his loss was still a fresh wound. It didn't help that she didn't often see her four children, who had long since left to work in the cities.")),
        paragraph(textNode("When I asked Doña Justina about her life on the island, she said she enjoyed running her store but didn't associate much with other villagers. Though she had come to Isla del Sol with her husband over a decade before, the tight-knit local community apparently still saw her as an outsider since she was born on the mainland. I wondered if perhaps her loneliness was what had made her open her home to a stranger. She mentioned that before that day, she had never spoken with any foreigners other than the tourists who occasionally entered her shop.")),
        paragraph(textNode('When Doña Justina asked about my life, I opted for telling her about my trip to avoid talking about my more privileged upbringing. She was shocked to learn that I was traveling on my own. "Y tus hijos?" what about your kids, she asked. I smiled and told her I wasn\'t a mother. She looked confused. "Tu marido te deja viajar sola?" your husband allows you to travel alone? she asked. I raised my eyebrows at this, but simply replied that I was single. Her dark eyes widened in silent shock.')),
        paragraph(textNode('Doña Justina was quick to offer some maternal warnings, saying I should look for a group of women to travel with, since a male family member wasn\'t there to chaperone and protect me. She added that I should never trust any men, since all of them "only wanted one thing" from me. I was taken aback. I was used to paranoid warnings from worried family members, but her condemnation of all men struck me.')),
        paragraph(textNode('I considered Doña Justina\'s words for a few moments before answering. I told her that many of the most kindhearted people I had met while traveling were men. Reading the skepticism in her eyes, I added that one of my favorite travel companions was my oldest close friend, a guy I\'d been friends with since I was seven years old. Doña Justina held my gaze thoughtfully. "Well," she finally said after several seconds, "I guess they can\'t all be bad."')),
        paragraph(textNode("I did not find Doña Justina's warnings absurd, only sad. I imagined living my life without ever enjoying friendship and mutual respect from men. How restrictive it would be to live in constant fear, assuming that all men were solely interested in using me for my body.")),
        paragraph(textNode("As I tried to imagine the world through Doña Justina's eyes, I began to feel ashamed of my rejection of Bolivia. I realized that many of her biases were just defense mechanisms that had shaped her worldview. I saw the effects not just in her view of men and foreigners, but in her acceptance of her own status as an outsider on Isla del Sol. Assumptions and subconscious defense mechanisms similar to hers had clouded my view of Bolivia, making me close myself off to the locals. I was dismayed by the ease with which defensive prejudice had obscured my vision. How many opportunities to connect had passed me by?")),
        paragraph(textNode("I was lucky enough to be sharing this meal and this conversation with Doña Justina because she had seen me not just as a foreigner, but as a fellow human being. Getting a glimpse of her world reminded me that people are a product of their story and of their environments. Bolivian distrust of outsiders didn't necessarily make them cold-hearted people.")),
        paragraph(textNode("After our meal, Doña Justina clasped both of my hands in hers and thanked me for coming. I promised I'd come see her again when I returned to spend a night on the island and explore its legendary ruins properly. After a tight goodbye hug, I hurried to catch the day's last ferry to the mainland.")),
        paragraph(textNode("When I went back to visit Doña Justina, I found her shop closed. A neighbor told me that she had gone to the mainland to see her family. I lamented the reality that I would probably never see the sweet cholita again, but I was thankful that our paths had crossed. I had almost left Bolivia believing its people to be cold and hostile by nature. Luckily, life sometimes offers signs that point our errors out to us. Meeting Doña Justina was one of those signs, a stroke of good luck that reminded me that the most important thing to bring with you when you travel is an open mind.")),
      ),
    },
    {
      title: "Are You Sure You're Not Being Manipulated?: Cutting Through Media Bias",
      slug: 'cutting-through-media-bias',
      categories: ['essays'] as ('essays')[],
      publishedDate: '2021-05-04',
      excerpt: "I think many would agree that navigating the media landscape these days has been downright exhausting.",
      sortOrder: 8,
      content: richText(
        paragraph(textNode("I think many would agree that navigating the media landscape these days has been downright exhausting. I'm often torn between the desire to know what's going on and the impulse to avoid all mentions of today's stress-inducing hot topics. Though I love taking periodic media breaks, I can't tune out forever. Issues like the global pandemic and today's social unrest are changing the world quickly and drastically. I've realized that whether we choose to participate in the conversation or step back from it, we owe it to ourselves to know what's going on. But, staying informed has its challenges.")),
        paragraph(textNode("Being well-informed is not just about gathering lots of information by reading or watching the news. It involves being selective with the sources of our information. The sources we trust are the ones we grant the power to shape our perception of reality and our opinions.")),
        paragraph(textNode("Social upheaval, economic disaster, divisive politicians, and other hot-button issues demand reactions from us. Partisan news can skew our perspectives with their approach to these controversial topics. Their biased presentation of the facts often creates an 'us versus them' mentality that makes conversation between opposing perspectives increasingly difficult. The resulting discord distracts us from the bigger picture. It cripples our ability to collaborate on bipartisan solutions for things like the structural failures and humanitarian issues at the root of today's social movements.")),
        heading('h2', textNode('What Media Bias Actually Looks Like')),
        paragraph(textNode("Thousands of media outlets are vying for attention through TV, podcasts, radio, print and web articles, and of course, social media. The number of viewers, readers, and clicks that news stories attract often determines their outlet's profit, which means our attention has a price tag on it.")),
        paragraph(textNode("Profit-driven media channels often seek to gain attention and trust by slanting their content to reinforce their audience's existing beliefs. Hyper-biased media stories sensationalize facts and focus on blaming the opposition. In doing so, these stories elicit strong reactions that make them more likely to spread.")),
        paragraph(textNode('Media bias does not necessarily involve outright lies and \'fake news\'. More commonly, partisan news outlets present the truth selectively, using language designed to guide our reactions. For example, for a story regarding overpopulated border facilities, a left-wing news source may say "Migrant families suffer unsanitary conditions in detention center," while a right-wing outlet may say, "Thousands of undocumented immigrants overcrowd border protection facility causing unsanitary conditions." The story is the same, but the language is quite different. Though you may think that most people would recognize that they\'re being influenced, studies suggest that most people can\'t tell the difference between biased and neutral sources.')),
        heading('h2', textNode('Methods For Cutting Through Media Bias')),
        paragraph(textNode("As we slog through the sensational news stories flooding TV, social media, and other platforms, there are several methods we can use to differentiate between fact, opinion, exaggeration, and fiction.")),
        paragraph(textNode("With individual stories, look for warning signs such as frequent reliance on anonymous sources and language that seems to aim for a particular emotional response. Some stories mask bias with phrases like 'many say,' 'this probably means,' and 'this will likely result in.' Finally, watch out for dramatic headlines, such as those that feature public figures giving controversial statements. Before you believe them or share them, look into the context and be aware of partisan efforts to point fingers.")),
        paragraph(textNode("Of course, it would be ideal if we could each keep a balanced media diet with sources from all across the spectrum of opinions. Realistically, few of us have the time or energy to find and compare multiple perspectives and fact-check every controversial news piece we see.")),
        heading('h2', textNode('The Simplest Antidote To Media Bias')),
        paragraph(textNode("A time-saving solution to avoiding biased media is to find out where the outlets we see the most fall on the spectrum of opinion, and to use neutral news outlets as our primary sources. Lucky for us, there have been multiple independent studies on media bias to make the selection process easier.")),
        paragraph(textNode("Some news outlets recognized for being the least biased are: C-SPAN, PBS, The Associated Press, Reuters, NPR, Forbes, and The BBC. Conversely, some of the most biased news sources to avoid are Fox News, CNN, The Huffington Post, Buzzfeed, Breitbart, Vox, MSNBC, The New Yorker, The National Review, and many more.")),
        paragraph(textNode("In turbulent times like today, I think it's particularly important to vet news sources carefully and maintain a level-headed perspective. In doing so, we can stop the spread of counterproductive discord and contribute to practical solutions.")),
      ),
    },
  ]

  for (const post of postsData) {
    await payload.create({
      collection: 'journal-posts',
      data: { ...post, _status: 'published' },
    })
  }
  console.log('Seeded 8 journal posts')

  // Seed site settings
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: 'Belu Malu',
      tagline: 'Chilean artist, based in the U.S.',
      contactEmail: 'hello@belumalu.com',
      copyrightText: '© 2026 Belu Malu · Art by Belu Maluenda',
      footerText: 'Made and shared for the joy of it. Thank you for supporting the dream.',
      emailSignupHeading: 'Join the journey',
      emailSignupBody: 'New work, stories, and market dates.',
      socialLinks: [
        { platform: 'instagram', url: 'https://www.instagram.com/belumaluarts/', handle: '@belumaluarts' },
        { platform: 'ebay', url: 'https://www.ebay.com/usr/belumaluarts', handle: 'belumaluarts' },
        { platform: 'reddit', url: 'https://www.reddit.com/user/BeluMalu/', handle: 'u/BeluMalu' },
        { platform: 'discord', url: 'https://discord.com/invite/JDhb9sNH5n', handle: 'Join the server' },
        { platform: 'facebook', url: 'https://www.facebook.com/belumaluarts', handle: 'belumaluarts' },
      ],
    },
  })
  console.log('Seeded site settings')

  // Seed about page
  await payload.updateGlobal({
    slug: 'about-page',
    data: {
      intro: "Born in Santiago, Chile but raised in the U.S., I always felt like I had one foot in either country, and that there was always a part of my identity I couldn't fully express.",
      pullQuote: 'Who I am is not rooted in where I come from, but in the things I love to do.',
      pullQuoteAttribution: 'Belu Maluenda',
      studioHeading: 'Made by hand, shared with heart',
      studioText: "Most days you'll find me with a brush in one hand and a coffee in the other, chasing colour and trying to make something that feels alive. Everything here is made by me, in small batches, for the love of it.",
      journeyStops: [
        { place: 'Chile', description: 'Santiago. Where it began.' },
        { place: 'The U.S.', description: 'Where I grew up, with one foot in each country.' },
        { place: 'South America', description: 'Seven months, solo, and a sense of self I could finally feel.' },
        { place: 'The Work', description: 'Making and sharing art, for the joy of it.' },
      ],
    },
  })
  console.log('Seeded about page')

  // Seed shop page
  await payload.updateGlobal({
    slug: 'shop-page',
    data: {
      heading: 'A new collection is on the way.',
      bodyText: "Hey there, thanks for stopping by my lil' shop. I'm deep in a new body of work right now, so the racks are quiet for a moment. Join the list for first access, or reach out if you're looking for an original, commission, or retired favourite.",
      signature: 'Thank you for the support. love, Belu',
      productCategories: [
        { title: 'Originals', description: 'One-of-a-kind paintings, signed and ready to hang.', priceRange: 'By inquiry' },
        { title: 'Fine Art Prints', description: 'Giclée reproductions on premium archival paper.', priceRange: 'From $35' },
        { title: 'Wearable Art', description: "Screen-printed tees you'll actually want to live in.", priceRange: 'From $32' },
        { title: 'Small Joys', description: 'Stickers, magnets, and little handmade things.', priceRange: 'From $4' },
      ],
    },
  })
  console.log('Seeded shop page')

  console.log('Seeding complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
