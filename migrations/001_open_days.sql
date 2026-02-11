CREATE TABLE IF NOT EXISTS open_days (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kindergarten_id INTEGER NOT NULL REFERENCES kindergartens(id),
  date TEXT NOT NULL,       -- ISO 8601: YYYY-MM-DD
  time_from TEXT,           -- HH:MM
  time_to TEXT,             -- HH:MM
  note TEXT
);

-- Bydel Grünerløkka

INSERT INTO open_days (kindergarten_id, date, time_from, time_to, note) VALUES
-- Akersløkka barnehage (id=1)
(1, '2026-02-23', '15:00', '15:45', 'Påmelding til maria.haldorsen@bga.oslo.kommune.no'),
-- Barnas hus barnehage (id=4)
(4, '2026-02-17', '10:00', NULL, NULL),
-- Barnehagenvår, Løren (id=5)
(5, '2026-02-09', '12:30', '13:30', NULL),
(5, '2026-02-12', '12:30', '13:30', NULL),
-- Bellevue Gård barnehage (id=6)
(6, '2026-02-11', '17:00', NULL, NULL),
(6, '2026-02-25', '17:00', NULL, NULL),
-- Brødfabrikken FUS barnehage (id=13)
(13, '2026-02-17', '17:15', '18:15', NULL),
-- Dynekilen barnehage (id=20)
(20, '2026-02-10', '14:00', NULL, 'Påmelding til irma.drinjakovic@bga.oslo.kommune.no'),
-- Espira Gartnerløkka barnehage (id=21)
(21, '2026-02-23', '17:30', NULL, 'Påmelding til styrer.gartnerlokka@espira.no'),
-- Espira Marienfryd barnehage (id=23)
(23, '2026-02-23', '17:15', '18:15', NULL),
-- Eventyrbrua Steinerbarnehage (id=25)
(25, '2026-02-09', '10:00', NULL, NULL),
-- Gaia barnehage (id=30)
(30, '2026-02-11', '17:30', '18:30', 'Påmelding til karoline.torkelsen@ulna.no'),
-- Gregers barnehage (id=31)
(31, '2026-02-23', '15:00', '16:00', NULL),
-- Grünerhagen barnehage (id=32)
(32, '2026-02-11', '12:30', '13:30', NULL),
(32, '2026-02-25', '12:30', '13:30', NULL),
-- Hallènparken barnehage (id=34)
(34, '2026-02-17', '17:15', '18:15', 'Påmelding til ida.pernille.h.skofteby@bga.oslo.kommune.no'),
(34, '2026-02-18', '17:15', '18:15', 'Påmelding til ida.pernille.h.skofteby@bga.oslo.kommune.no'),
-- Hammerfestgata barnehage (id=35)
(35, '2026-02-16', '13:00', NULL, NULL),
-- Hovin barnehage (id=40)
(40, '2026-02-17', '10:00', NULL, NULL),
(40, '2026-02-19', '10:00', NULL, NULL),
-- Læringsverkstedet Konfektfabrikken (id=65)
(65, '2026-02-09', '10:00', '11:00', 'Påmelding til konfektfabrikken@laringsverkstedet.no'),
-- Krydderhagen barnehage (id=48)
(48, '2026-02-17', '10:00', NULL, NULL),
-- Lykketrollet familiebarnehage Frydensgate (id=58)
(58, '2026-02-23', '09:00', '11:00', NULL),
-- Lykketrollet familiebarnehage Sverdrups gate (id=59)
(59, '2026-02-24', '09:00', '11:00', NULL),
-- Løren Botaniske barnehage (id=69)
(69, '2026-02-18', '12:30', '13:30', NULL),
-- Nedregate barnehage (id=77)
(77, '2026-02-10', '17:00', NULL, 'Møt i Nedre gate 5'),
(77, '2026-02-25', '17:00', NULL, 'Møt i Nedre gate 5'),
-- Norlandia Kanonen barnehage (id=78)
(78, '2026-02-03', '13:00', NULL, 'Møt i Generalen, 2. etg.'),
(78, '2026-02-12', '13:00', NULL, 'Møt i Generalen, 2. etg.'),
-- Ola Narr barnehage (id=81)
(81, '2026-02-04', '10:00', NULL, NULL),
(81, '2026-02-11', '10:00', NULL, NULL),
-- Rodeløkka barnehage (id=87)
(87, '2026-02-04', '17:00', '18:30', NULL),
-- Seilduken barnehage (id=89)
(89, '2026-02-05', '12:00', NULL, 'Påmelding til post@seilduken.no'),
(89, '2026-02-12', '12:00', NULL, 'Påmelding til post@seilduken.no'),
-- Sinsen barnehage (id=90)
(90, '2026-02-26', '16:00', '17:00', NULL),
-- Sinsen kirkes barnehage (id=91)
(91, '2026-02-24', '17:15', '18:30', NULL),
-- Sjokoladefabrikken barnehage (id=92)
(92, '2026-02-23', '13:15', '14:00', 'Påmelding til iben.elster@bga.oslo.kommune.no'),
-- Støperiet barnehage (id=96)
(96, '2026-02-09', '12:00', NULL, NULL),
(96, '2026-02-13', '12:00', NULL, NULL),
-- Teglverket barnehage (id=97)
(97, '2026-02-05', '17:00', '18:00', 'Påmelding til guro.naverdal@bga.oslo.kommune.no'),
(97, '2026-02-11', '17:00', '18:00', 'Påmelding til guro.naverdal@bga.oslo.kommune.no'),
-- Læringsverkstedet Waldemars barnehage (id=67)
(67, '2026-02-25', '12:00', '13:00', NULL),

-- Bydel Sagene

-- Bjølsenhellinga barnehage (id=9)
(9, '2026-02-06', '12:00', NULL, 'Møt på lekeplassen'),
-- Bjølsenparken barnehage (id=10)
(10, '2026-02-06', '12:30', NULL, 'Møt på lekeplassen'),
-- Den tysk-norske barnehage (id=17)
(17, '2026-02-24', '17:15', '18:00', NULL),
-- Dronning Louises barnehage (id=19)
(19, '2026-02-12', '10:00', NULL, NULL),
-- Espira Grefsen Stasjon barnehage (id=22)
(22, '2026-02-05', '16:00', '17:00', 'Påmelding til iselin.sneeggen.hollum@espira.no'),
-- Espira Torshovdalen barnehage (id=24)
(24, '2026-02-27', '12:00', '13:00', NULL),
-- Fernanda FUS barnehage (id=28)
(28, '2026-02-12', '17:15', '18:30', NULL),
-- Idun FUS barnehage (id=41)
(41, '2026-02-12', '17:00', '18:00', NULL),
-- Kongsberggata barnehage (id=47)
(47, '2026-02-17', '10:00', NULL, NULL),
(47, '2026-02-25', '10:00', NULL, NULL),
-- Lilleborg barnehage (id=51)
(51, '2026-02-03', '15:00', '16:30', NULL),
(51, '2026-02-10', '15:00', '16:30', NULL),
-- Lillo gård barnehage (id=52)
(52, '2026-02-12', '14:00', NULL, 'Påmelding til ada.sexe-lysvik@bsa.oslo.kommune.no'),
(52, '2026-02-19', '14:00', NULL, 'Påmelding til ada.sexe-lysvik@bsa.oslo.kommune.no'),
-- Lillohagen FUS barnehage (id=53)
(53, '2026-02-11', '17:00', '18:00', 'Bruk hjørneinngang ved lekeplassen'),
-- Lillohøyden FUS barnehage (id=54)
(54, '2026-02-12', '17:45', '18:30', NULL),
-- Lykketrollet familiebarnehage Bentsegata (id=57)
(57, '2026-02-10', '09:00', '11:00', NULL),
-- Lykketrollet familiebarnehage Vogts gate 32 A (id=60)
(60, '2026-02-10', '09:00', '11:00', NULL),
-- Lykketrollet familiebarnehage Vogts gate 32 B (id=61)
(61, '2026-02-10', '09:00', '11:00', NULL),
-- Lykketrollet familiebarnehage Vogts gate 32 C (id=62)
(62, '2026-02-10', '09:00', '11:00', NULL),
-- Læringsverkstedet DoReMi Myrens barnehage (id=63)
(63, '2026-02-25', '17:30', '19:00', NULL),
-- Margarinfabrikken barnehage Gamlebygget (id=71)
(71, '2026-02-12', '12:00', '13:00', 'Gamlebygget – møt utenfor i Stavangergata'),
(71, '2026-02-26', '12:00', '13:00', 'Gamlebygget – møt utenfor i Stavangergata'),
-- Margarinfabrikken barnehage Nybygget (id=71)
(71, '2026-02-05', '12:00', '13:00', 'Nybygget – møt utenfor i Stavangergata'),
(71, '2026-02-19', '12:00', '13:00', 'Nybygget – møt utenfor i Stavangergata'),
-- Maridalsveien barnehage (id=72)
(72, '2026-02-12', '16:30', '17:15', NULL),
(72, '2026-02-25', '16:30', '17:15', NULL),
-- Marihøna familiebarnehage (id=74) - every Wed in Feb
(74, '2026-02-04', '09:00', '10:30', NULL),
(74, '2026-02-11', '09:00', '10:30', NULL),
(74, '2026-02-18', '09:00', '10:30', NULL),
(74, '2026-02-25', '09:00', '10:30', NULL),
-- Mor Go'hjertas barnehage (id=76)
(76, '2026-02-09', '14:00', NULL, 'Påmelding til kjersti.lerdalen@bsa.oslo.kommune.no'),
(76, '2026-02-16', '14:00', NULL, 'Påmelding til kjersti.lerdalen@bsa.oslo.kommune.no'),
(76, '2026-02-23', '14:00', NULL, 'Påmelding til kjersti.lerdalen@bsa.oslo.kommune.no'),
-- Nydalen allé barnehage (id=80)
(80, '2026-02-03', '17:15', NULL, NULL),
(80, '2026-02-11', '17:15', NULL, NULL),
-- Oskar Braaten barnehage (id=82)
(82, '2026-02-13', '11:30', '12:30', NULL),
-- Pontoppidan barnehage (id=83)
(83, '2026-02-18', '10:00', NULL, NULL),
-- Ragnas hage (id=84)
(84, '2026-02-11', '17:15', '19:00', NULL),
-- Riflegata barnehage (id=85)
(85, '2026-02-16', '12:00', '12:45', NULL),
-- Ringnes Park FUS barnehage (id=86)
(86, '2026-02-05', '17:15', '18:15', NULL),
-- Thor Olsen barnehage (id=98)
(98, '2026-02-19', '10:00', NULL, NULL),
(98, '2026-02-26', '12:00', NULL, NULL),
-- Vøyensvingen barnehage (id=103)
(103, '2026-02-10', '12:30', '13:30', 'Påmelding til anita.lilleengen@bsa.oslo.kommune.no'),
-- Åsenhagen barnehage (id=104)
(104, '2026-02-11', '13:30', NULL, NULL),

-- Bydel St. Hanshaugen

-- Akersveien Kanvas-barnehage (id=2)
(2, '2026-02-10', '12:00', NULL, NULL),
(2, '2026-02-19', '12:00', NULL, NULL),
-- Bislettbekken - Sio barnehage (id=7)
(7, '2026-02-17', '10:00', NULL, 'Påmelding til merete.kolstad@sio.no'),
(7, '2026-02-17', '12:00', NULL, 'Påmelding til merete.kolstad@sio.no'),
-- Blindernveien – Sio barnehage (id=11)
(11, '2026-02-16', '10:00', NULL, 'Påmelding til simen.oien@sio.no'),
(11, '2026-02-16', '14:00', NULL, 'Påmelding til simen.oien@sio.no'),
-- Breidablikk barnehage (id=12)
(12, '2026-02-10', '12:30', '13:30', NULL),
(12, '2026-02-17', '12:30', '13:30', NULL),
-- Collettløkka barnehage (id=15)
(15, '2026-02-03', '09:30', '10:30', 'Påmelding på nettsiden'),
(15, '2026-02-24', '09:30', '10:30', 'Påmelding på nettsiden'),
-- Dr. Brandts barnehage (id=18)
(18, '2026-02-04', '09:30', '10:30', NULL),
-- Fagerborggaten barnehage (id=27) - every Friday in Feb
(27, '2026-02-06', '12:00', '12:30', 'Påmelding til galina.dyrnes@bsh.oslo.kommune.no'),
(27, '2026-02-13', '12:00', '12:30', 'Påmelding til galina.dyrnes@bsh.oslo.kommune.no'),
(27, '2026-02-20', '12:00', '12:30', 'Påmelding til galina.dyrnes@bsh.oslo.kommune.no'),
(27, '2026-02-27', '12:00', '12:30', 'Påmelding til galina.dyrnes@bsh.oslo.kommune.no'),
-- Fryd barnehage (id=29) - every Friday in Feb
(29, '2026-02-06', '12:00', '13:00', NULL),
(29, '2026-02-13', '12:00', '13:00', NULL),
(29, '2026-02-20', '12:00', '13:00', NULL),
(29, '2026-02-27', '12:00', '13:00', NULL),
-- Hammersborg barnehage (id=36)
(36, '2026-02-10', '12:00', '13:00', NULL),
(36, '2026-02-17', '12:00', '13:00', NULL),
-- Hasselhaugen barnehage (id=37)
(37, '2026-02-18', '12:00', '13:00', 'Påmelding til camilla.sletteng@bsh.oslo.kommune.no'),
-- Hausmannsgate barnehage (id=38)
(38, '2026-02-20', '10:00', NULL, 'Påmelding til karina.sivertsen@bsh.oslo.kommune.no'),
-- Heftyes barnehage (id=39) - every Tuesday in Feb
(39, '2026-02-03', '10:00', '11:00', NULL),
(39, '2026-02-10', '10:00', '11:00', NULL),
(39, '2026-02-17', '10:00', '11:00', NULL),
(39, '2026-02-24', '10:00', '11:00', NULL),
-- Jutul Kanvas-barnehage (id=42)
(42, '2026-02-10', '10:00', '11:00', NULL),
(42, '2026-02-17', '10:00', '11:00', NULL),
(42, '2026-02-24', '10:00', '11:00', NULL),
-- Katta barnehage (id=43)
(43, '2026-02-25', '17:30', '18:30', NULL),
-- Kirsebærjordet barnehage (id=46)
(46, '2026-02-04', '12:00', '12:30', NULL),
(46, '2026-02-11', '12:00', '12:30', NULL),
(46, '2026-02-25', '12:00', '12:30', NULL),
-- Lille Bislett - Sio barnehage (id=50)
(50, '2026-02-17', '10:00', NULL, 'Påmelding til merete.kolstad@sio.no'),
(50, '2026-02-17', '12:00', NULL, 'Påmelding til merete.kolstad@sio.no'),
-- Lindekroken Kanvas-barnehage (id=55)
(55, '2026-02-11', '12:00', '14:00', NULL),
(55, '2026-02-18', '12:00', '14:00', NULL),
(55, '2026-02-25', '12:00', '14:00', NULL),
-- Læringsverkstedet Langaard barnehage (id=66)
(66, '2026-02-18', '17:30', '18:30', 'Påmelding til langaard@laringsverkstedet.no'),
-- Løkkeberg barnehage (id=68)
(68, '2026-02-04', '10:00', '11:00', NULL),
(68, '2026-02-10', '10:00', '11:00', NULL),
-- Marienlyst Gård barnehage (id=73) - drop-in Wednesdays in Feb
(73, '2026-02-04', '12:00', '14:00', NULL),
(73, '2026-02-11', '12:00', '14:00', NULL),
(73, '2026-02-18', '12:00', '14:00', NULL),
(73, '2026-02-25', '12:00', '14:00', NULL),
-- Melkeveien barnehage (id=75)
(75, '2026-02-23', '17:00', '19:00', NULL),
-- Skrellinga Kanvas-barnehage (id=93)
(93, '2026-02-10', '11:00', '12:00', NULL),
(93, '2026-02-17', '11:00', '12:00', NULL),
(93, '2026-02-24', '11:00', '12:00', NULL),
-- Trollstua Kanvas-barnehage (id=100)
(100, '2026-02-11', '12:00', '13:00', NULL),
(100, '2026-02-18', '12:00', '13:00', NULL),
(100, '2026-02-25', '12:00', '13:00', NULL),
-- Tusentrippen barnehage (id=101) - drop-in Tuesdays in Feb
(101, '2026-02-03', '12:00', '14:00', NULL),
(101, '2026-02-10', '12:00', '14:00', NULL),
(101, '2026-02-17', '12:00', '14:00', NULL),
(101, '2026-02-24', '12:00', '14:00', NULL),
-- Veslefrikk Kanvas-barnehage (id=102)
(102, '2026-02-19', '09:30', '10:15', NULL),
(102, '2026-02-26', '09:30', '10:15', NULL);
