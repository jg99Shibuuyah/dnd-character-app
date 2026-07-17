// Built-in game content, one file per type (split from the old builtins.js).
// Loaded as classic scripts BEFORE /app.js (see src/views/*.html) in the order
// listed in README.md — every top-level const here is a global shared with
// app.js and the /modules scripts. User-imported ("custom") data is DB-backed
// and merged into these registries at startup by app.js.
// ---------- Backgrounds: BACKGROUND_DATA ----------

// ---------- Backgrounds ----------
// Character backgrounds (PHB-style, per the dnd5e wikidot reference pages).
// `skills` are fixed proficiencies the background GRANTS (auto-applied to the
// sheet while selected — see grantedSkillSources). `languages`/`tools`/
// `equipment` are informational text; `feature` shows on Features & Traits.
const BACKGROUND_DATA = {
  Acolyte:{ source:'5E', skills:['Insight','Religion'], languages:'Two of your choice', equipment:'Holy symbol, prayer book or prayer wheel, 5 sticks of incense, vestments, common clothes, pouch with 15 gp',
    desc:'You have spent your life in service to a temple, learning its rites and acting as an intermediary between the divine and the mortal world.',
    feature:{name:'Shelter of the Faithful', desc:'You command the respect of those who share your faith and can perform your deity\'s ceremonies. You and your companions can receive free healing and care at a temple of your faith (you must provide any material components), and followers of your religion will support you at a modest lifestyle. You also have ties to a specific temple whose priests will assist you, so long as the request is not hazardous and you remain in good standing.'} },
  Charlatan:{ source:'5E', skills:['Deception','Sleight of Hand'], tools:'Disguise kit, forgery kit', equipment:'Fine clothes, disguise kit, con tools of your choice, pouch with 15 gp',
    desc:'You have always had a way with people, and know exactly what makes them tick — usually to relieve them of their valuables.',
    feature:{name:'False Identity', desc:'You have a second identity — documentation, established acquaintances, and disguises included. You can also forge documents (official papers and personal letters) as long as you have seen an example.'} },
  Criminal:{ source:'5E', skills:['Deception','Stealth'], tools:"One type of gaming set, thieves' tools", equipment:'Crowbar, dark common clothes with a hood, pouch with 15 gp',
    desc:'You are an experienced criminal with a history of breaking the law and contacts deep in the underworld.',
    feature:{name:'Criminal Contact', desc:'You have a reliable and trustworthy contact who acts as your liaison to a network of other criminals. You know how to get messages to and from your contact, even over great distances.'} },
  Entertainer:{ source:'5E', skills:['Acrobatics','Performance'], tools:'Disguise kit, one musical instrument', equipment:'Musical instrument, an admirer\'s favor, costume, pouch with 15 gp',
    desc:'You thrive in front of an audience, making the world your stage — poet, singer, dancer, or acrobat.',
    feature:{name:'By Popular Demand', desc:'You can always find a place to perform. There you receive free lodging and food of a modest or comfortable standard as long as you perform each night, and your performance makes you something of a local figure.'} },
  'Folk Hero':{ source:'5E', skills:['Animal Handling','Survival'], tools:"One type of artisan's tools, vehicles (land)", equipment:"Artisan's tools, shovel, iron pot, common clothes, pouch with 10 gp",
    desc:'You come from humble ranks, but you are destined for much more — the people of your home village regard you as their champion.',
    feature:{name:'Rustic Hospitality', desc:'Since you come from the ranks of the common folk, you fit in among them with ease. You can find a place to hide, rest, or recuperate among commoners, who will shield you from the law or anyone searching for you (though not at the risk of their lives).'} },
  'Guild Artisan':{ source:'5E', skills:['Insight','Persuasion'], tools:"One type of artisan's tools", languages:'One of your choice', equipment:"Artisan's tools, letter of introduction from your guild, traveler's clothes, pouch with 15 gp",
    desc:'You are a member of an artisan\'s guild, skilled in a particular field and closely associated with other artisans.',
    feature:{name:'Guild Membership', desc:'Your guild offers lodging and food when necessary and will pay for your funeral if needed. Fellow members will provide access to powerful political figures — for a price. You must pay dues of 5 gp per month to stay in good standing.'} },
  Hermit:{ source:'5E', skills:['Medicine','Religion'], tools:'Herbalism kit', languages:'One of your choice', equipment:'Scroll case of notes, winter blanket, common clothes, herbalism kit, 5 gp',
    desc:'You lived in seclusion — in a sheltered community or entirely alone — seeking quiet, solitude, and answers.',
    feature:{name:'Discovery', desc:'Your seclusion gave you access to a unique and powerful discovery — a great truth about the cosmos, a hidden site, or a long-forgotten fact. Work out its exact nature with your DM.'} },
  Noble:{ source:'5E', skills:['History','Persuasion'], tools:'One type of gaming set', languages:'One of your choice', equipment:'Fine clothes, signet ring, scroll of pedigree, purse with 25 gp',
    desc:'You understand wealth, power, and privilege — your family owns land, collects taxes, and wields real political influence.',
    feature:{name:'Position of Privilege', desc:'Thanks to your noble birth, people are inclined to think the best of you. You are welcome in high society, and people assume you have the right to be wherever you are. Common folk accommodate you, and you can secure an audience with a local noble if needed.'} },
  Outlander:{ source:'5E', skills:['Athletics','Survival'], tools:'One musical instrument', languages:'One of your choice', equipment:"Staff, hunting trap, animal trophy, traveler's clothes, pouch with 10 gp",
    desc:'You grew up in the wilds, far from civilization — the wilderness is in your blood, wherever you go.',
    feature:{name:'Wanderer', desc:'You have an excellent memory for maps and geography, and can always recall the general layout of terrain, settlements, and features around you. You can also find food and fresh water for yourself and up to five others each day, provided the land offers it.'} },
  Sage:{ source:'5E', skills:['Arcana','History'], languages:'Two of your choice', equipment:'Bottle of ink, quill, small knife, letter from a dead colleague with an unanswered question, common clothes, pouch with 10 gp',
    desc:'You spent years learning the lore of the multiverse, studying manuscripts and the greatest experts on your subjects of interest.',
    feature:{name:'Researcher', desc:'When you attempt to learn or recall a piece of lore and don\'t know it, you often know where and from whom you can obtain it — a library, scriptorium, university, or a sage or other learned person. Unearthing the deepest secrets of the multiverse may require an adventure or a whole campaign.'} },
  Sailor:{ source:'5E', skills:['Athletics','Perception'], tools:"Navigator's tools, vehicles (water)", equipment:'Belaying pin (club), 50 ft of silk rope, lucky charm, common clothes, pouch with 10 gp',
    desc:'You sailed on a seagoing vessel for years, weathering storms, monsters of the deep, and those who wanted to sink your craft.',
    feature:{name:"Ship's Passage", desc:'When you need to, you can secure free passage on a sailing ship for yourself and your companions. In return, you and your companions are expected to assist the crew during the voyage.'} },
  Soldier:{ source:'5E', skills:['Athletics','Intimidation'], tools:'One type of gaming set, vehicles (land)', equipment:'Insignia of rank, trophy from a fallen enemy, set of bone dice or deck of cards, common clothes, pouch with 10 gp',
    desc:'War has been your life for as long as you care to remember — you trained, drilled, and fought as part of an army.',
    feature:{name:'Military Rank', desc:'You have a military rank from your career as a soldier. Soldiers loyal to your former organization still recognize your authority and influence, and will defer to you if of a lower rank. You can requisition simple equipment or horses for temporary use and gain access to friendly military encampments and fortresses.'} },
  Urchin:{ source:'5E', skills:['Sleight of Hand','Stealth'], tools:"Disguise kit, thieves' tools", equipment:'Small knife, map of your home city, pet mouse, token of your parents, common clothes, pouch with 10 gp',
    desc:'You grew up on the streets alone, orphaned and poor, learning to fend for yourself.',
    feature:{name:'City Secrets', desc:'You know the secret patterns and flow of cities and can find passages through the urban sprawl that others would miss. When not in combat, you and companions you lead can travel between any two locations in a city twice as fast as your speed would normally allow.'} },
};
Object.values(BACKGROUND_DATA).forEach(bd=>{ if(!bd.source) bd.source='5E'; bd.builtin=true; });
