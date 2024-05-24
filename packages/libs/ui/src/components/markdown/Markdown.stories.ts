import type { Meta, StoryObj } from '@storybook/vue3';

import MarkdownView from './LyMarkdownView.vue';

const meta = {
  title: 'Example/Markdown',
  component: MarkdownView,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: [],
} satisfies Meta<typeof MarkdownView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const View: Story = {
  args: {
    md:
      '# Patriam resupinus nemus et ignotas hosti pavida\n' +
      '\n' +
      '## Vix omnes\n' +
      '\n' +
      'Lorem markdownum proles Bacchei *arbitrium Apollo dabatur* potest vicibus,\n' +
      '[cum](http://unde.io/). Rustica credere, **animo equitavit omnes** labe animal,\n' +
      'loquentis nunc Marte tuorum, ut una et. Aequoris inferna crimine: remittat\n' +
      'capillis, si quae negabit Delonque conata. Fluctus Seriphon spatio nepoti\n' +
      '**voluntas in Tereu** in latius celebri non haeret **arcana adulterium nihil**\n' +
      'Ergo.\n' +
      '\n' +
      '1. Metuunt quodque exercet\n' +
      '2. Geminis incumbens longam rosarum et\n' +
      '3. O notam Ixione gemini pereunt honorant fatum\n' +
      '\n' +
      'Vos urbes sanguine quod mitibus ventus; digitos caput eruiturque mundo! Inducere\n' +
      '**bracchia** vires pro caesariem procul quoque. Defluit otia.\n' +
      '\n' +
      '    simmUserSsd -= taskWhitelist;\n' +
      '    var default_dimm_monitor = oop_yottabyte_cpa(pseudocode_media);\n' +
      '    inkjet_hub_xml += log(57) * -2 - lockVirtual - mount;\n' +
      '\n' +
      '## Venata templa\n' +
      '\n' +
      'In nives; et arva mulces et prolis, obstat venientesque manu rugis secutum. Nec\n' +
      'Thescelus semianimem populi; vulnere curru lacrimisque tamen mugitus, vix et.\n' +
      'Cepisse Labros solverat genuisse propiorque ad ponto testatus soleo, vidit et!\n' +
      'Nihil vulnera sumit Cyclopum nunc, *inveniesque piasque* caecisque sibi postquam\n' +
      'ore. Sede mirumque [celerique](http://arboris.com/) certe furtum: adice et\n' +
      'sentit iaculantem.\n' +
      '\n' +
      '    if (user_page_sip < 1) {\n' +
      '        format_interface = core_lan;\n' +
      '    } else {\n' +
      '        hub_syntax_bar = infringement;\n' +
      '        tween_www_node = 1;\n' +
      '        impact_load_smb += host;\n' +
      '    }\n' +
      '    system_program_cgi.fddiFile -= bitmap;\n' +
      '    minimize_plain.emulationRwWordart = dv.internalBin(checksum_core);\n' +
      '    switch_zettabyte += social_webmaster_ibm;\n' +
      '\n' +
      'Cursus inque in innecte erat. Potae licet nemus illic metuam moveri hora; rupit,\n' +
      'servaturis saxum, toros regalia.\n' +
      '\n' +
      'Cera duris *tormentis* et passu. Gente uni: prensoque sidereos, occurrensque\n' +
      'curvum, incisa.\n',
  },
};
