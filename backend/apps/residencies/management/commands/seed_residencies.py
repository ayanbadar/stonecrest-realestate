from decimal import Decimal

from django.core.management.base import BaseCommand

from apps.residencies.models import Property

SEED_PROPERTIES = [
    {
        "title": "Skyline Penthouse, Downtown",
        "status": Property.Status.SALE,
        "property_type": Property.PropertyType.PENTHOUSE,
        "price": Decimal("28500000"),
        "bedrooms": 4,
        "bathrooms": 5,
        "area_sqft": 6200,
        "community": "Downtown Dubai",
        "short_description": "A rare full-floor penthouse with unbroken views of the Burj Khalifa.",
        "description": (
            "Conceived for collectors of vertical living, this full-floor residence "
            "pairs double-height reception rooms with a private terrace overlooking "
            "the fountain and boulevard. Interiors are restrained — stone, bronze, "
            "and floor-to-ceiling glass — leaving the skyline as the sole spectacle."
        ),
        "is_featured": True,
    },
    {
        "title": "Palm Frond Villa",
        "status": Property.Status.SALE,
        "property_type": Property.PropertyType.VILLA,
        "price": Decimal("42000000"),
        "bedrooms": 6,
        "bathrooms": 7,
        "area_sqft": 11800,
        "community": "Palm Jumeirah",
        "short_description": "Private beach access and a sculptural pool pavilion on the Palm.",
        "description": (
            "Set on a generous frond plot, the villa opens to the Gulf with a "
            "sequence of shaded courtyards, a wellness wing, and a guest pavilion. "
            "Architecture is quietly monumental — pale limestone, teak, and water."
        ),
        "is_featured": True,
    },
    {
        "title": "Emirates Hills Estate",
        "status": Property.Status.SALE,
        "property_type": Property.PropertyType.VILLA,
        "price": Decimal("55000000"),
        "bedrooms": 7,
        "bathrooms": 8,
        "area_sqft": 15200,
        "community": "Emirates Hills",
        "short_description": "Golf-front estate with formal gardens and a private cinema.",
        "description": (
            "An estate residence arranged around a central court, with formal "
            "reception suites, a lower-level spa, and landscaped gardens that "
            "meet the fairway. Craftsmanship is exacting throughout."
        ),
        "is_featured": True,
    },
    {
        "title": "Marina Residence, 03",
        "status": Property.Status.RENT,
        "property_type": Property.PropertyType.APARTMENT,
        "price": Decimal("320000"),
        "bedrooms": 3,
        "bathrooms": 4,
        "area_sqft": 2800,
        "community": "Dubai Marina",
        "short_description": "Waterfront apartment with a wraparound terrace and marina views.",
        "description": (
            "A quietly finished three-bedroom residence oriented to the marina "
            "and beyond. Interiors favour natural light, soft stone, and a "
            "kitchen conceived for both everyday living and entertaining."
        ),
        "is_featured": False,
    },
    {
        "title": "Jumeirah Townhouse Collection",
        "status": Property.Status.SALE,
        "property_type": Property.PropertyType.TOWNHOUSE,
        "price": Decimal("9800000"),
        "bedrooms": 4,
        "bathrooms": 5,
        "area_sqft": 4100,
        "community": "Jumeirah",
        "short_description": "Contemporary townhouse steps from the beach and boutique streets.",
        "description": (
            "Four levels of refined living with a roof terrace overlooking the "
            "district. The plan balances private suites with an open entertaining "
            "floor that opens to a landscaped courtyard."
        ),
        "is_featured": False,
    },
    {
        "title": "Creek Harbour Loft",
        "status": Property.Status.SALE,
        "property_type": Property.PropertyType.APARTMENT,
        "price": Decimal("6200000"),
        "bedrooms": 2,
        "bathrooms": 3,
        "area_sqft": 1950,
        "community": "Dubai Creek Harbour",
        "short_description": "Double-height loft with creek views and atelier finishes.",
        "description": (
            "An atelier-like loft with a mezzanine study, curated joinery, and "
            "floor-to-ceiling glazing toward the creek and skyline."
        ),
        "is_featured": True,
    },
    {
        "title": "Business Bay Corner Suite",
        "status": Property.Status.RENT,
        "property_type": Property.PropertyType.APARTMENT,
        "price": Decimal("240000"),
        "bedrooms": 2,
        "bathrooms": 2,
        "area_sqft": 1600,
        "community": "Business Bay",
        "short_description": "Corner suite with canal aspect and turnkey furnishings.",
        "description": (
            "A turnkey two-bedroom suite designed for executives seeking "
            "proximity to Downtown with a quieter canal-facing aspect."
        ),
        "is_featured": False,
    },
    {
        "title": "Arabian Ranches Courtyard Villa",
        "status": Property.Status.SALE,
        "property_type": Property.PropertyType.VILLA,
        "price": Decimal("12500000"),
        "bedrooms": 5,
        "bathrooms": 6,
        "area_sqft": 7200,
        "community": "Arabian Ranches",
        "short_description": "Family villa organised around a shaded courtyard garden.",
        "description": (
            "A five-bedroom villa with indoor–outdoor living at its core — "
            "courtyard garden, pool terrace, and a separate guest wing."
        ),
        "is_featured": False,
    },
    {
        "title": "Bluewaters Island Residence",
        "status": Property.Status.RENT,
        "property_type": Property.PropertyType.APARTMENT,
        "price": Decimal("450000"),
        "bedrooms": 3,
        "bathrooms": 4,
        "area_sqft": 3100,
        "community": "Bluewaters Island",
        "short_description": "Island apartment with private beach club privileges.",
        "description": (
            "A luminous three-bedroom residence on Bluewaters, finished in "
            "pale oak and stone, with a dedicated maid’s room and sea outlook."
        ),
        "is_featured": True,
    },
    {
        "title": "DIFC Sky Office Residence",
        "status": Property.Status.SALE,
        "property_type": Property.PropertyType.APARTMENT,
        "price": Decimal("8900000"),
        "bedrooms": 3,
        "bathrooms": 3,
        "area_sqft": 2400,
        "community": "DIFC",
        "short_description": "Vertical living above the financial district’s cultural spine.",
        "description": (
            "A three-bedroom residence with gallery lighting, a chef’s kitchen, "
            "and uninterrupted views across the Gate and city beyond."
        ),
        "is_featured": False,
    },
]


class Command(BaseCommand):
    help = "Seed Stonecrest placeholder residencies (text only — upload images via the app)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Delete existing properties before seeding.",
        )

    def handle(self, *args, **options):
        if options["reset"]:
            deleted, _ = Property.objects.all().delete()
            self.stdout.write(self.style.WARNING(f"Deleted {deleted} property rows."))

        created = 0
        for item in SEED_PROPERTIES:
            _, was_created = Property.objects.update_or_create(
                title=item["title"],
                defaults={**item, "is_published": True},
            )
            if was_created:
                created += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Seed complete. {created} created, {len(SEED_PROPERTIES) - created} updated."
            )
        )
