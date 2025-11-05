import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.rating.deleteMany()
  await prisma.userBadge.deleteMany()
  await prisma.badge.deleteMany()
  await prisma.pointOfInterest.deleteMany()
  await prisma.tour.deleteMany()
  await prisma.place.deleteMany()
  await prisma.user.deleteMany()

  // Create Places
  const louvre = await prisma.place.create({
    data: {
      name: 'Musée du Louvre',
      type: 'museum',
      latitude: 48.8606,
      longitude: 2.3376,
      rating: 4.8,
      ratingsCount: 12543,
      description: "Le Musée du Louvre à Paris est le plus grand musée d'art du monde et un monument historique. Chef-d'œuvre de l'architecture, il abrite une collection exceptionnelle qui s'étend de l'Antiquité au XIXe siècle. Des chefs-d'œuvre comme la Joconde, la Vénus de Milo et la Victoire de Samothrace y sont exposés. Avec ses 35 000 œuvres exposées sur 72 735 m², le Louvre est une destination incontournable pour les amateurs d'art du monde entier.",
      mustSee: ['La Joconde', 'Vénus de Milo', 'Victoire de Samothrace', 'Le Radeau de la Méduse'],
      visitTimes: '09:00-18:00 (fermé le mardi)',
      bestTime: 'Mercredi soir (nocturne) ou tôt le matin',
      photos: [
        'https://images.unsplash.com/photo-1499856871958-5b9627545d1a',
        'https://images.unsplash.com/photo-1550340499-a6c60fc8287c'
      ],
      pointsOfInterest: {
        create: [
          {
            name: 'La Joconde',
            description: "Le portrait le plus célèbre au monde, peint par Léonard de Vinci entre 1503 et 1519. Ce tableau fascine par le sourire énigmatique de Mona Lisa et la technique du sfumato utilisée par le maître de la Renaissance. L'œuvre attire des millions de visiteurs chaque année qui viennent admirer ce mystérieux chef-d'œuvre.",
            photos: ['https://images.unsplash.com/photo-1564399579883-451a5d44ec08'],
            audioGuide: '/audio/mona-lisa.mp3'
          },
          {
            name: 'Vénus de Milo',
            description: "Cette sculpture grecque antique, datant d'environ 130-100 av. J.-C., représente Aphrodite, la déesse de l'amour et de la beauté. Découverte en 1820 sur l'île de Milos, elle est célèbre pour sa grâce intemporelle et ses bras manquants, qui ajoutent à son mystère.",
            photos: ['https://images.unsplash.com/photo-1566354867-68f27e972a29'],
            audioGuide: '/audio/venus-de-milo.mp3'
          }
        ]
      },
      badge: {
        create: {
          id: 'louvre-master',
          name: 'Maître du Louvre',
          icon: '🎨',
          description: 'Vous avez visité le plus grand musée du monde'
        }
      }
    }
  })

  const eiffelTower = await prisma.place.create({
    data: {
      name: 'Tour Eiffel',
      type: 'monument',
      latitude: 48.8584,
      longitude: 2.2945,
      rating: 4.7,
      ratingsCount: 25678,
      description: "Symbole incontesté de Paris et de la France, la Tour Eiffel a été construite par Gustave Eiffel pour l'Exposition Universelle de 1889. Haute de 330 mètres, elle offre une vue panoramique exceptionnelle sur Paris depuis ses trois étages. Illuminée chaque soir, la Dame de Fer accueille près de 7 millions de visiteurs par an, faisant d'elle le monument payant le plus visité au monde.",
      mustSee: ['Sommet de la tour', 'Vue panoramique', 'Illuminations nocturnes'],
      visitTimes: '09:30-23:45 (horaires variables selon la saison)',
      bestTime: 'Lever ou coucher du soleil, ou illuminations après 23h',
      photos: [
        'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f',
        'https://images.unsplash.com/photo-1502602898657-3e91760cbb34'
      ],
      pointsOfInterest: {
        create: [
          {
            name: 'Sommet',
            description: "Le point culminant de la Tour Eiffel offre une vue à 360° sur Paris. Par temps clair, on peut voir jusqu'à 60 km à la ronde. Un moment magique, surtout au coucher du soleil.",
            photos: ['https://images.unsplash.com/photo-1549144511-f099e773c147'],
            audioGuide: '/audio/eiffel-summit.mp3'
          }
        ]
      },
      badge: {
        create: {
          id: 'eiffel-climber',
          name: 'Grimpeur de la Dame de Fer',
          icon: '🗼',
          description: 'Vous avez atteint le sommet de la Tour Eiffel'
        }
      }
    }
  })

  const notreDame = await prisma.place.create({
    data: {
      name: 'Cathédrale Notre-Dame de Paris',
      type: 'church',
      latitude: 48.8530,
      longitude: 2.3499,
      rating: 4.6,
      ratingsCount: 18234,
      description: "Chef-d'œuvre de l'architecture gothique, Notre-Dame de Paris a été construite entre 1163 et 1345. Située sur l'île de la Cité, cette cathédrale emblématique a traversé les siècles et inspiré de nombreuses œuvres, dont le célèbre roman de Victor Hugo. Ses rosaces, ses gargouilles et ses voûtes spectaculaires témoignent du génie architectural médiéval. Actuellement en restauration suite à l'incendie de 2019.",
      mustSee: ['Rosaces', 'Gargouilles', 'Tours et clochers'],
      visitTimes: 'En restauration (réouverture prévue en 2024)',
      bestTime: 'À suivre après réouverture',
      photos: [
        'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
        'https://images.unsplash.com/photo-1549144511-f099e773c147'
      ],
      badge: {
        create: {
          id: 'notre-dame-devotee',
          name: 'Gardien de Notre-Dame',
          icon: '⛪',
          description: 'Vous avez exploré cette cathédrale légendaire'
        }
      }
    }
  })

  const versailles = await prisma.place.create({
    data: {
      name: 'Château de Versailles',
      type: 'castle',
      latitude: 48.8049,
      longitude: 2.1204,
      rating: 4.7,
      ratingsCount: 15892,
      description: "Le Château de Versailles est l'un des plus beaux accomplissements de l'art français au XVIIe siècle. Ancienne résidence des rois de France, il symbolise la puissance et le faste de la monarchie absolue. Ses jardins à la française, la Galerie des Glaces, les appartements royaux et le domaine de Marie-Antoinette constituent un ensemble architectural et paysager exceptionnel.",
      mustSee: ['Galerie des Glaces', 'Grands Appartements', 'Jardins à la française', 'Trianon'],
      visitTimes: '09:00-18:30 (fermé le lundi)',
      bestTime: 'Mardi ou mercredi matin',
      photos: [
        'https://images.unsplash.com/photo-1602852453657-aab315d1c4e6',
        'https://images.unsplash.com/photo-1570939274717-7eda259b50ed'
      ],
      pointsOfInterest: {
        create: [
          {
            name: 'Galerie des Glaces',
            description: "Cette galerie longue de 73 mètres était destinée à éblouir les visiteurs. Ses 357 miroirs reflètent la lumière des 17 fenêtres donnant sur les jardins. C'est ici que fut signé le Traité de Versailles en 1919.",
            photos: ['https://images.unsplash.com/photo-1560969184-10fe8719e047'],
            audioGuide: '/audio/hall-of-mirrors.mp3'
          }
        ]
      },
      badge: {
        create: {
          id: 'versailles-royal',
          name: 'Courtisan Royal',
          icon: '👑',
          description: 'Vous avez découvert la splendeur de Versailles'
        }
      }
    }
  })

  const orsay = await prisma.place.create({
    data: {
      name: 'Musée d\'Orsay',
      type: 'museum',
      latitude: 48.8600,
      longitude: 2.3266,
      rating: 4.7,
      ratingsCount: 9856,
      description: "Installé dans une ancienne gare Beaux-Arts, le Musée d'Orsay possède la plus importante collection d'œuvres impressionnistes et post-impressionnistes au monde. On y trouve des chefs-d'œuvre de Monet, Renoir, Degas, Cézanne, Van Gogh et bien d'autres. L'architecture unique du bâtiment, avec sa grande nef et son horloge géante, ajoute au charme de la visite.",
      mustSee: ['Bal du moulin de la Galette (Renoir)', 'La chambre de Van Gogh', 'Impression, soleil levant (Monet)'],
      visitTimes: '09:30-18:00 (fermé le lundi)',
      bestTime: 'Jeudi soir (nocturne)',
      photos: [
        'https://images.unsplash.com/photo-1575377222312-dd1a63a51638',
        'https://images.unsplash.com/photo-1560969184-10fe8719e047'
      ],
      badge: {
        create: {
          id: 'impressionist-expert',
          name: 'Expert Impressionniste',
          icon: '🌅',
          description: 'Vous maîtrisez l\'art impressionniste'
        }
      }
    }
  })

  const sacreCoeur = await prisma.place.create({
    data: {
      name: 'Basilique du Sacré-Cœur',
      type: 'church',
      latitude: 48.8867,
      longitude: 2.3431,
      rating: 4.6,
      ratingsCount: 11234,
      description: "Perchée au sommet de la butte Montmartre, la Basilique du Sacré-Cœur domine Paris de ses dômes blancs immaculés. Construite entre 1875 et 1914, cette basilique romano-byzantine offre l'une des plus belles vues panoramiques sur la capitale. Son intérieur abrite l'une des plus grandes mosaïques de France.",
      mustSee: ['Mosaïque du Christ', 'Vue panoramique', 'Crypte'],
      visitTimes: '06:00-22:30 (tous les jours)',
      bestTime: 'Lever ou coucher du soleil',
      photos: [
        'https://images.unsplash.com/photo-1548840722-4eede2e2e81a',
        'https://images.unsplash.com/photo-1558465375-89a76fc174f9'
      ],
      badge: {
        create: {
          id: 'montmartre-pilgrim',
          name: 'Pèlerin de Montmartre',
          icon: '⛪',
          description: 'Vous avez gravi les marches du Sacré-Cœur'
        }
      }
    }
  })

  console.log('✅ Places created')

  // Create a test user
  const testUser = await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'test@example.com',
      password: '$2b$10$YourHashedPasswordHere', // bcrypt hash of "password123"
      interests: ['art', 'history', 'architecture'],
      visitedPlaces: [louvre.id]
    }
  })

  console.log('✅ Test user created')

  // Create some ratings
  await prisma.rating.create({
    data: {
      userId: testUser.id,
      placeId: louvre.id,
      rating: 5,
      comment: 'Un musée absolument incroyable !'
    }
  })

  console.log('✅ Sample ratings created')

  // Create a sample tour
  await prisma.tour.create({
    data: {
      name: 'Paris Classique - 4 heures',
      description: 'Découvrez les monuments emblématiques de Paris',
      placeIds: [louvre.id, eiffelTower.id, notreDame.id],
      duration: 240,
      distance: 5200,
      userPreferences: ['art', 'history', 'architecture']
    }
  })

  console.log('✅ Sample tour created')

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
