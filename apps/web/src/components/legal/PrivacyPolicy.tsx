import CustomLink from '@/components/common/CustomLink'

const PrivacyPolicy = () => {
  return (
    <>
      <h1 id="privacy-policy">Privacy Policy</h1>

      <p>Last updated: November 2025</p>

      <p>
        Safe Labs GmbH, Unter den Linden 10, 10117 Berlin (hereinafter &quot;<strong>Safe Labs</strong>&quot;, &quot;
        <strong>we</strong>&quot; or &quot;<strong>us</strong>&quot;) takes the protection of personal data very
        seriously.
      </p>

      <p>
        We treat personal data confidentially and always in accordance with Regulation (EU) 2016/679 (hereinafter &quot;
        <strong>General Data Protection Regulation</strong>&quot; or &quot;<strong>GDPR</strong>&quot;), the German
        Federal Data Protection Act (hereinafter &quot;<strong>BDSG</strong>&quot;), and in accordance with the
        provisions of this Privacy Policy.
      </p>

      <p>
        The aim of this Privacy Policy is to inform you (hereinafter &quot;<strong>Data Subject</strong>&quot; or &quot;
        <strong>you</strong>&quot;) in accordance with GDPR Art.12 et seq. about how we process your personal data and
        for what purposes we process your personal data when using our website https://safe.global/ and other websites
        we own and operate (hereinafter &quot;<strong>Website</strong>&quot; and together &quot;
        <strong>Websites</strong>&quot;) as well as our mobile applications, services or contacting us.
      </p>

      <p>
        Unless otherwise stated in this Privacy Policy, the terms used here have the meaning as defined in the GDPR.
      </p>

      <p>
        <strong>Table of Contents</strong>
      </p>

      <p>
        <a href="#glossary">1. Glossary</a>
      </p>
      <p>
        <a href="#your-information-and-the-blockchain">2. Your information and the Blockchain</a>
      </p>
      <p>
        <a href="#how-we-use-personal-data">3. How we use personal data</a>
      </p>
      <p>
        <a href="#when-visiting-our-website-and-using-safe-interfaces">
          3.1. When visiting our Website and using Safe Interfaces
        </a>
      </p>
      <p>
        <a href="#tracking-and-analysis">3.2. Tracking and analysis</a>
      </p>
      <p>
        <a href="#when-participating-in-user-experience-research-uxr">
          3.3. When participating in user experience research (UXR)
        </a>
      </p>
      <p>
        <a href="#downloading-the-safemobile-app">3.4. Downloading the Safe&#123;Mobile&#125; app</a>
      </p>
      <p>
        <a href="#use-of-the-safemobile-app">3.5. Use of the Safe&#123;Mobile&#125; app</a>
      </p>
      <p>
        <a href="#contacting-us">3.6. Contacting us</a>
      </p>
      <p>
        <a href="#data-receivers">4. Data receivers</a>
      </p>
      <p>
        <a href="#use-of-subprocessors">5. Use of Subprocessors</a>
      </p>
      <p>
        <a href="#blockchain">5.1. Blockchain</a>
      </p>
      <p>
        <a href="#amazon-web-services">5.2. Amazon Web Services</a>
      </p>
      <p>
        <a href="#datadog">5.3. Datadog</a>
      </p>
      <p>
        <a href="#mobile-app-stores">5.4. Mobile app stores</a>
      </p>
      <p>
        <a href="#fingerprinttouch-id-face-id">5.5. Fingerprint/Touch ID/ Face ID</a>
      </p>
      <p>
        <a href="#google-firebase">5.6. Google Firebase</a>
      </p>
      <p>
        <a href="#walletconnect">5.7. WalletConnect</a>
      </p>
      <p>
        <a href="#sentry">5.8. Sentry</a>
      </p>
      <p>
        <a href="#beamer">5.9. Beamer</a>
      </p>
      <p>
        <a href="#node-providers">5.10. Node providers</a>
      </p>
      <p>
        <a href="#tenderly">5.11. Tenderly</a>
      </p>
      <p>
        <a href="#moonpay">5.12. MoonPay</a>
      </p>
      <p>
        <a href="#spindl">5.13. Spindl</a>
      </p>
      <p>
        <a href="#fingerprint">5.14. Fingerprint</a>
      </p>
      <p>
        <a href="#personal-data-transfers-to-third-countries">6. Personal data transfers to third countries</a>
      </p>
      <p>
        <a href="#automated-decision-makingprofiling">7. Automated decision-making/profiling</a>
      </p>
      <p>
        <a href="#obligation-to-provide-personal-data">8. Obligation to provide personal data</a>
      </p>
      <p>
        <a href="#storing-personal-data">9. Storing personal data</a>
      </p>
      <p>
        <a href="#your-rights-as-a-data-subject">10. Your rights as a data subject</a>
      </p>
      <p>
        <a href="#changes-to-this-privacy-policy">11. Changes to this Privacy Policy</a>
      </p>
      <p>
        <a href="#contact-us">12. Contact us</a>
      </p>

      <p>&nbsp;</p>

      <h1 id="glossary">1. Glossary</h1>

      <p>What do some of the capitalized terms mean in this policy?</p>

      <ol>
        <li>
          &quot;<strong>Blockchain</strong>&quot; means a mathematically secured consensus ledger such as the Ethereum
          Virtual Machine, an Ethereum Virtual Machine compatible validation mechanism, or other decentralized
          validation mechanisms.
        </li>
        <li>
          &quot;<strong>Transaction</strong>&quot; means a change to the data set through a new entry in the continuous
          Blockchain.
        </li>
        <li>
          &quot;<strong>Smart Contract</strong>&quot; is a piece of source code deployed as an application on the
          Blockchain which can be executed, including self-execution of Transactions as well as execution triggered by
          3rd parties.
        </li>
        <li>
          &quot;<strong>Token</strong>&quot; is a digital asset transferred in a Transaction, including ETH, ERC20,
          ERC721 and ERC1155 tokens.
        </li>
        <li>
          &quot;<strong>Wallet</strong>&quot; is a cryptographic storage solution permitting you to store cryptographic
          assets by correlation of a (i) Public Key and (ii) a Private Key or a Smart Contract to receive, manage and
          send Tokens.
        </li>
        <li>
          &quot;<strong>Recovery Phrase</strong>&quot; is a series of secret words used to generate one or more Private
          Keys and derived Public Keys.
        </li>
        <li>
          &quot;<strong>Public Key</strong>&quot; is a unique sequence of numbers and letters within the Blockchain to
          distinguish the network participants from each other.
        </li>
        <li>
          &quot;<strong>Private Key</strong>&quot; is a unique sequence of numbers and/or letters required to initiate a
          Blockchain Transaction and should only be known by the legal owner of the Wallet.
        </li>
        <li>
          &quot;<strong>Safe Account</strong>&quot; is a modular, self-custodial (i.e. not supervised by us) smart
          contract-based Wallet. Safe Accounts are{' '}
          <CustomLink href="https://github.com/safe-global/safe-contracts/">
            <strong>open-source</strong>
          </CustomLink>{' '}
          released under LGPL-3.0.
        </li>
        <li>
          &quot;<strong>Safe Interfaces</strong>&quot; refers to Safe&#123;Wallet&#125; a web-based graphical user
          interface for Safe Accounts as well as a mobile application on Android and iOS.
        </li>
        <li>
          &quot;<strong>Safe Account Transaction</strong>&quot; is a Transaction of a Safe Account, authorized by a
          user, typically via their Wallet.
        </li>
        <li>
          &quot;<strong>Profile</strong>&quot; means the Public Key and user provided, human readable label stored
          locally on the user&apos;s device.
        </li>
      </ol>

      <h1 id="your-information-and-the-blockchain">2. Your information and the Blockchain</h1>

      <p>
        Blockchains, also known as distributed ledger technology (or simply &quot;DLT&quot;), are made up of digitally
        recorded data in a chain of packages called &quot;blocks&quot;. The manner in which these blocks are linked is
        chronological, meaning that the data is very difficult to alter once recorded. Since the ledger may be
        distributed all over the world (across several &quot;nodes&quot; which usually replicate the ledger) this means
        there is no single person making decisions or otherwise administering the system (such as an operator of a cloud
        computing system), and that there is no centralized place where it is located either.
      </p>

      <p>
        Accordingly, by design, records of a Blockchain cannot be changed or deleted and are said to be
        &quot;immutable&quot;. This affects your ability to exercise your rights such as your right to erasure
        (&quot;right to be forgotten&quot;), or your rights to object or restrict processing of your personal data
        because data on the Blockchain cannot be erased and cannot be changed. Although smart contracts may be used to
        revoke certain access rights, and some content may be made invisible to others, it is not deleted.
      </p>

      <p>
        In certain circumstances, in order to comply with our contractual obligations to you (such as delivery of
        Tokens) it will be necessary to write certain personal data, such as your Wallet address, onto the Blockchain;
        this is done through a smart contract and requires you to execute such transactions using your Wallet&apos;s
        Private Key.
      </p>

      <p>
        In most cases ultimate decisions to (i) transact on the Blockchain using your Wallet, as well as (ii) share the
        Public Key relating to your Wallet with anyone (including us) rests with you.
      </p>

      <p>
        IF YOU WANT TO ENSURE YOUR PRIVACY RIGHTS ARE NOT AFFECTED IN ANY WAY, YOU SHOULD NOT TRANSACT ON BLOCKCHAINS AS
        CERTAIN RIGHTS MAY NOT BE FULLY AVAILABLE OR EXERCISABLE BY YOU OR US DUE TO THE TECHNOLOGICAL INFRASTRUCTURE OF
        THE BLOCKCHAIN. IN PARTICULAR THE BLOCKCHAIN IS AVAILABLE TO THE PUBLIC AND ANY PERSONAL DATA SHARED ON THE
        BLOCKCHAIN WILL BECOME PUBLICLY AVAILABLE.
      </p>

      <h1 id="how-we-use-personal-data">3. How we use personal data</h1>

      <h2 id="when-visiting-our-website-and-using-safe-interfaces">
        3.1 When visiting our Website and using Safe Interfaces
      </h2>

      <p>
        When visiting our Website or using Safe Interfaces, we will collect and process personal data. Such personal
        data will be stored in different instances
      </p>

      <ol>
        <li>
          <p>
            We connect the Wallet to the web Safe&#123;Wallet&#125; app to identify the user via their public Wallet
            address. For this purpose we process:
          </p>
          <ol>
            <li>public Wallet address, and</li>
            <li>WalletConnect connection data.</li>
          </ol>
        </li>
        <li>
          <p>
            We process personal data when you fill out forms to register for a demo or request more information about
            new product integrations. Personal data processed include:
          </p>
          <ol>
            <li>Full name;</li>
            <li>Email address;</li>
            <li>Company name;</li>
            <li>Location;</li>
            <li>Responses to open text fields;</li>
            <li>Safe Wallet address (optional);</li>
            <li>Telegram account (optional).</li>
          </ol>
        </li>
      </ol>

      <p>
        We rely on the user consent (Art. 6.1a GDPR) to process this information, as users can choose to fill out an
        optional form should they be currently interested in our partnership with Hypernative with the goal of adding
        their transaction protection technology and its &quot;Guardian&quot; product into Safe&#123;Wallet&#125; to
        create a jointly commercialized experience that offers automated, policy-based transaction guarding with native
        discoverability and seamless user experience. We retain this data for a year after collection through the form.
      </p>

      <p>
        Please note that Hypernative will also be collecting the same data when you fill out the form, and processing it
        in accordance with the terms stipulated in their Privacy Policy.
      </p>

      <ol start={3}>
        <li>
          <p>
            When you create a new Safe Account we process the following personal data to compose a Transaction based on
            your entered data to be approved by your Wallet:
          </p>
          <ol>
            <li>your public Wallet address,</li>
            <li>account balance,</li>
            <li>smart contract address of your Safe Account,</li>
            <li>addresses of externally owned accounts, and</li>
            <li>user activity.</li>
          </ol>
        </li>
        <li>
          <p>
            When you create a Profile for a new Safe Account we process the following personal data for the purpose of
            enabling you to view your Safe Account after creation as well as enabling you to view all co-owned Safes
            Accounts:
          </p>
          <ol>
            <li>your public Wallet address, and</li>
            <li>account balance.</li>
          </ol>
        </li>
        <li>
          <p>
            When you create a Profile for an existing Safe Account for the purpose of allowing you to view and use them
            in the Safe Interface, we process your
          </p>
          <ol>
            <li>public Wallet address,</li>
            <li>Safe Account balance,</li>
            <li>smart contract address of the Safe Account, and</li>
            <li>Safe Account owner&apos;s public Wallet addresses.</li>
          </ol>
        </li>
        <li>
          <p>
            When you initiate a Safe Account Transaction we process the following personal data to compose the
            Transaction for you based on your entered personal data:
          </p>
          <ol>
            <li>your public Wallet address, and</li>
            <li>smart contract address of Safe Account.</li>
          </ol>
        </li>
        <li>
          <p>
            When you sign a Safe Account Transaction we process the following personal data to enable you to sign the
            Transaction using your Wallet:
          </p>
          <ol>
            <li>Safe Account balance,</li>
            <li>smart contract address of Safe Account, and</li>
            <li>Safe Account owner&apos;s public Wallet addresses.</li>
          </ol>
        </li>
        <li>
          <p>To enable you to execute the Transaction on the Blockchain we process:</p>
          <ol>
            <li>your public Wallet address,</li>
            <li>Safe Account balance,</li>
            <li>smart contract address of Safe Account,</li>
            <li>Safe Account owner&apos;s public Wallet addresses, and</li>
            <li>Transactions signed by all Safe Account owners.</li>
          </ol>
        </li>
        <li>
          <p>
            When we collect relevant personal data from the Blockchain to display context information in the Safe
            Interface we process:
          </p>
          <ol>
            <li>your public Wallet address,</li>
            <li>account balance,</li>
            <li>account activity, and</li>
            <li>Safe Account owner&apos;s Public wallet addresses.</li>
          </ol>
        </li>
        <li>
          <p>
            When we decode Transactions from the Blockchain for the purpose of providing Transaction information in a
            conveniently readable format, we process:
          </p>
          <ol>
            <li>your public Wallet address,</li>
            <li>account balance, and</li>
            <li>account activity.</li>
          </ol>
        </li>
        <li>
          <p>
            When we maintain a user profile to provide you with a good user experience through Profiles and an address
            book we process:
          </p>
          <ol>
            <li>your public Wallet address,</li>
            <li>label,</li>
            <li>smart contract address of Safe Account,</li>
            <li>Safe Account owner&apos;s public wallet addresses,</li>
            <li>last used Wallet (for automatic reconnect),</li>
            <li>last used chain id,</li>
            <li>selected currency,</li>
            <li>theme, and</li>
            <li>address format.</li>
          </ol>
          <p>
            The legal base for all these activities is the performance of the contract we have with you (GDPR Art.
            6.1b).
          </p>
          <p>
            THE PERSONAL DATA WILL BE STORED ON THE BLOCKCHAIN. GIVEN THE TECHNOLOGICAL DESIGN OF THE BLOCKCHAIN, AS
            EXPLAINED IN SECTION 2, THIS PERSONAL DATA WILL BECOME PUBLIC AND IT WILL NOT LIKELY BE POSSIBLE TO DELETE
            OR CHANGE THE PERSONAL DATA AT ANY GIVEN TIME.
          </p>
        </li>
      </ol>

      <h2 id="tracking-and-analysis">3.2 Tracking and analysis</h2>

      <p>3.2.1 We will process the following personal data to analyze your behavior:</p>

      <ol>
        <li>IP address (will not be stored for EU users),</li>
        <li>session tracking,</li>
        <li>user behavior,</li>
        <li>wallet type,</li>
        <li>Safe Account address,</li>
        <li>Signer wallet address,</li>
        <li>device and browser user agent,</li>
        <li>user consent,</li>
        <li>operating system,</li>
        <li>referrers, and</li>
        <li>user behavior: subpage, duration, and revisit, the date and time of access.</li>
      </ol>

      <p>
        The collected personal data is solely used in the legitimate interest of improving our services and user
        experience. Such personal data is stored only temporarily and is deleted after 14 months.
      </p>

      <p>We do not track any of the following data:</p>

      <ol>
        <li>wallet signatures, and</li>
        <li>granular transaction details.</li>
      </ol>

      <p>
        In the case you have given consent, we will additionally store an analytics cookie on your device to identify
        you as a user across browsing sessions. The lawful basis for this processing is your prior consent (GDPR
        Art.6.1a) when agreeing to accept cookies. You can revoke your consent at any time with effect for the future
        via the cookie banner. The withdrawal of your consent does not affect the lawfulness of processing based on your
        consent before its withdrawal.
      </p>

      <p>
        3.2.2 For general operational analysis of the Safe&#123;Wallet&#125; app interface, monitoring transaction
        origins and measuring transaction failure rates to ensure improved service performance and reliability, we
        process information which constitutes the transaction service database, such as:
      </p>

      <ol>
        <li>signatures,</li>
        <li>signature_type,</li>
        <li>ethereum_tx_id,</li>
        <li>message_hash,</li>
        <li>safe_app_id, and</li>
        <li>safe_message_id.</li>
      </ol>

      <p>
        We conduct this analysis in our legitimate interest to continuously improve our services and ensure increased
        service performance and reliability (GDPR Art.6.1f).
      </p>

      <p>
        3.3.3 We conduct technical monitoring of your activity on the platform in order to ensure availability,
        integrity and robustness of the service. For this purpose, we process your:
      </p>

      <ol>
        <li>IP addresses,</li>
        <li>meta and communication data,</li>
        <li>website access, and</li>
        <li>log data.</li>
      </ol>

      <p>
        The lawful basis for this processing is our legitimate interest (GDPR Art.6.1f) in ensuring the correctness of
        the service.
      </p>

      <p>3.2.4 Anonymized tracking</p>

      <p>
        We will anonymize the following personal data to gather anonymous user statistics on your browsing behavior on
        our website:
      </p>

      <ol>
        <li>daily active users,</li>
        <li>new users acquired from a specific campaign,</li>
        <li>user journeys,</li>
        <li>number of users per country, and</li>
        <li>difference in user behavior between mobile vs. web visitors.</li>
      </ol>

      <p>
        The lawful basis for this processing is our legitimate interest (GDPR Art.6.1f) in improving our services and
        user experience.
      </p>

      <h2 id="when-participating-in-user-experience-research-uxr">
        3.3 When participating in user experience research (UXR)
      </h2>

      <p>
        When you participate in our user experience research we may collect and process some personal data. Such
        personal data may include:
      </p>

      <ol>
        <li>your name,</li>
        <li>your e-mail,</li>
        <li>your phone type,</li>
        <li>your occupation, and</li>
        <li>range of managed funds.</li>
      </ol>

      <p>
        In addition, we may take a recording of you while testing the Safe Interfaces for internal and external use. The
        basis for this collection and processing is our legitimate business interest in monitoring and improving our
        services.
      </p>

      <p>
        The lawful basis for this processing is your informed consent (GDPR Art.6.1f) as provided before participating
        in user experience research. You can revoke your consent at any time with effect for the future by email to
        safelabs.dpo@techgdpr.com. The withdrawal of your consent does not affect the lawfulness of processing based on
        your consent before its withdrawal.
      </p>

      <h2 id="downloading-the-safemobile-app">3.4 Downloading the Safe&#123;Mobile&#125; app</h2>

      <p>3.4.1 Downloading the Safe&#123;Mobile&#125; app on Google Play Store.</p>

      <p>
        We process the following information to enable you to download the Safe&#123;Wallet&#125; app on smartphones
        running Android:
      </p>

      <ol>
        <li>google account, and</li>
        <li>e-mail address.</li>
      </ol>

      <p>3.4.2 Downloading the Safe&#123;Mobile&#125; app on Apple App Store</p>

      <p>
        We process the following information to enable you to download the Safe&#123;Mobile&#125; app on smartphones
        running iOS:
      </p>

      <ol>
        <li>apple account, and</li>
        <li>e-mail address.</li>
      </ol>

      <p>
        The lawful basis for these two processing activities is the performance of the contract we have with you (GDPR
        Art.6.1b).
      </p>

      <h2 id="use-of-the-safemobile-app">3.5 Use of the Safe&#123;Mobile&#125; app</h2>

      <p>
        3.5.1 We provide the Safe&#123;Mobile&#125; app to you to enable you to use it. For this purpose we process
        your:
      </p>

      <ol>
        <li>mobile device information,</li>
        <li>http request caches, and</li>
        <li>http request cookies.</li>
      </ol>

      <p>
        3.5.2 In order to update you about changes in the Safe&#123;Mobile&#125; app, we need to send you push
        notifications. For this purpose we process your:
      </p>

      <ol>
        <li>Transactions executed and failed,</li>
        <li>assets sent, and</li>
        <li>assets received.</li>
      </ol>

      <p>
        3.5.3 To provide support to you and notify you about outage resulting in unavailability of the service, we
        process your:
      </p>

      <ol>
        <li>pseudonymized user identifier.</li>
      </ol>

      <p>
        3.5.4 In order to provide remote client configuration and control whether to inform about, recommend or force
        you to update your Safe&#123;Mobile&#125; app or enable/disable certain Safe&#123;Mobile&#125; app features we
        process your:
      </p>

      <ol>
        <li>user agent,</li>
        <li>Safe&#123;Mobile&#125; app information (version, build number etc.),</li>
        <li>language,</li>
        <li>country,</li>
        <li>platform,</li>
        <li>operating system,</li>
        <li>browser,</li>
        <li>device category,</li>
        <li>user audience,</li>
        <li>user property,</li>
        <li>user in random percentage,</li>
        <li>imported segment,</li>
        <li>date/time,</li>
        <li>first open, and</li>
        <li>installation ID.</li>
      </ol>

      <p>
        For all these activities (3.5.1-3.5.4) we rely on the legal base of performance of a contract (GDPR Art.6.1b)
        with you.
      </p>

      <p>3.5.5 To report errors and improve user experience we process your:</p>

      <ol>
        <li>user agent info (Browser, OS, device),</li>
        <li>URL that you were on (can contain Safe Account address), and</li>
        <li>error info: time, stacktrace.</li>
      </ol>

      <p>We rely on our legitimate interest (GDPR Art.6.1f) of ensuring our service quality.</p>

      <p>
        3.5.6 We process your personal data to allow you to authenticate using your gmail account or AppleID and to
        create a signer wallet/owner account. For that purpose following personal data is processed:
      </p>

      <ol>
        <li>anonymised device information and identifiers, e.g. IP address, cookie IDs, device type,</li>
        <li>user account authentication information (e.g. username, password),</li>
        <li>
          unique user identifier (e.g. a random string associated with authentication, at times can be email. If so,
          sensitive strings are processed but hashed and not stored), and
        </li>
        <li>connection and usage information (e.g. logins to the application).</li>
      </ol>

      <p>
        For this processing, we rely on our legitimate interest (GDPR Art.6.1f) of facilitating the onboarding for users
        and ameliorating the user experience with regards to our services.
      </p>

      <p>
        3.5.7 Providing on and off-ramp services to enable you to top up your Safe Account with e.g. bank transfer,
        debit card, credit card. For this purpose MoonPay may process your:
      </p>

      <ol>
        <li>full name,</li>
        <li>date of birth,</li>
        <li>nationality,</li>
        <li>gender,</li>
        <li>signature,</li>
        <li>utility bills,</li>
        <li>photographs,</li>
        <li>phone number,</li>
        <li>home address,</li>
        <li>email,</li>
        <li>
          information about the transactions you make via MoonPay services (e.g. name of the recipient, your name, the
          amount, and/or timestamp),
        </li>
        <li>geo location/tracking details,</li>
        <li>operating system, and</li>
        <li>personal IP addresses.</li>
      </ol>

      <p>
        To conduct this activity we rely on our legitimate interest (GDPR Art.6.1f) of ameliorating the onboarding
        process and the user experience through providing an easier option to customers to fund their account.
      </p>

      <p>
        3.5.8 Geofencing users in the US to prevent locking safe tokens, which may result in them being classified as
        securities. For this purpose, we process the following information relating to a user&apos;s device:
      </p>

      <ol>
        <li>operating system,</li>
        <li>browser and browser configuration,</li>
        <li>IP address, and</li>
        <li>approximate location.</li>
      </ol>

      <p>
        We rely on our legitimate interest to ensure that our services or derivatives do not extend into sectors in
        which we are not licensed to operate in (GDPR Art.6.1f). Safe Labs is not licensed to provide or trade
        securities in the US and therefore cannot operate in the securities market.
      </p>

      <p>
        3.5.9 We process personal data to detect use of VPN aimed at circumventing the restriction in section 3.5.8
        above and to prevent fraud. Personal data processed include:
      </p>

      <ol>
        <li>operating system,</li>
        <li>browser and browser configuration,</li>
        <li>IP address, and</li>
        <li>approximate location.</li>
      </ol>

      <p>
        We rely on our legitimate interest to ensure the prevention of fraud (GDPR Art.6.1f). This also helps us detect
        users who may want to circumvent the restriction on US users by the use of VPN.
      </p>

      <p>
        3.5.10 We process personal data when you fill out forms to register for a demo or request more information about
        new product integrations. Personal data processed include:
      </p>

      <ol>
        <li>Full name;</li>
        <li>Email address;</li>
        <li>Company name;</li>
        <li>Location;</li>
        <li>Responses to open text fields;</li>
        <li>SafeWallet address (optional);</li>
        <li>Telegram account (optional).</li>
      </ol>

      <p>
        We rely on the user consent (Art. 6.1a GDPR) to process this information, as users can choose to fill out an
        optional form should they be currently interested in our partnership with Hypernative with the goal of adding
        their transaction protection technology and its &quot;Guardian&quot; product into Safe&#123;Wallet&#125; to
        create a jointly commercialized experience that offers automated, policy-based transaction guarding with native
        discoverability and seamless user experience. We retain this data for a year after collection through the form.
      </p>

      <p>
        Please note that Hypernative will also be collecting the same data when you fill out the form, and processing it
        in accordance with the terms stipulated in their Privacy Policy.
      </p>

      <h2 id="contacting-us">3.6 Contacting us</h2>

      <p>
        It is possible to contact us on our Website by e-mail or via the contact form. When you contact us, we collect
        and process certain information in connection with your specific request, such as, <em>e.g.</em>, your name,
        e-mail address, and other data requested by us or personal data you voluntarily provide to us (hereinafter
        &quot;<strong>Contact Data</strong>&quot;). If you contact us as part of an existing contractual relationship or
        contact us in advance for information about our range of services, the Contact Data will be processed for the
        performance of a contract or in order to take steps prior to entering into a contract and to respond to your
        contact request in accordance with GDPR Art.6.1.b.
      </p>

      <p>
        Otherwise, the legal basis for the processing of Contact Data is GDPR Art.6.1.f. The Contact Data is processed
        to pursue our legitimate interests in responding appropriately to customer/contact inquiries.
      </p>

      <h1 id="data-receivers">4. Data receivers</h1>

      <p>
        We may transfer your personal data to our business partners, administration centers, third party service
        providers, agents, subcontractors and other associated organizations for the purposes of completing tasks and
        providing our services to you.
      </p>

      <p>
        In addition, we might transfer your personal data to certain data receivers if such transfer is necessary to
        fulfill our contractual and legal obligations.
      </p>

      <p>
        In individual cases, we transfer personal data to our consultants in legal or tax matters, whereby these
        recipients act independently in their own data protection responsibilities and are also obliged to comply with
        the requirements of the GDPR and other applicable data protection regulations. In addition, they are bound by
        special confidentiality and secrecy obligations due to their professional position.
      </p>

      <p>
        In the event of corporate transactions (<em>e.g.</em>, sale of our business or a part of it) or as part of any
        business restructuring or reorganization, we may transfer personal data to involved advisors or to potential
        buyers.
      </p>

      <p>
        Additionally, we also use services provided by various specialized companies, <em>e.g.</em>, IT service
        providers, that process personal data on our behalf (&quot;<strong>Data Processor</strong>&quot;). We have
        concluded a data processing agreement according to GDPR Art.28 or EU standard contractual clauses of the EU
        Commission pursuant to GDPR Art.46.2.c with each service provider and they only process personal data in
        accordance with our instructions and not for their own purposes.
      </p>

      <h1 id="use-of-subprocessors">5. Use of Subprocessors</h1>

      <h2 id="blockchain">5.1. Blockchain</h2>

      <p>
        When using Safe Accounts your smart contract address, Safe Account Transactions, addresses of signer accounts
        and ETH balances and token balances will be stored on the Blockchain. See section 2 of this Policy
      </p>

      <p>
        THE INFORMATION WILL BE DISPLAYED PERMANENTLY AND PUBLIC, THIS IS PART OF THE NATURE OF THE BLOCKCHAIN. IF YOU
        ARE NEW TO THIS FIELD, WE HIGHLY RECOMMEND INFORMING YOURSELF ABOUT THE BLOCKCHAIN TECHNOLOGY BEFORE USING OUR
        SERVICES.
      </p>

      <h2 id="amazon-web-services">5.2. Amazon Web Services</h2>

      <p>
        We use{' '}
        <CustomLink href="https://aws.amazon.com/">
          <strong>Amazon Web Services (AWS)</strong>
        </CustomLink>{' '}
        to store log and database data as described in section 5.1.
      </p>

      <h2 id="datadog">5.3. Datadog</h2>

      <p>
        We use{' '}
        <CustomLink href="https://www.datadoghq.com/">
          <strong>Datadog</strong>
        </CustomLink>{' '}
        to store log data as described in section 5.1.
      </p>

      <h2 id="mobile-app-stores">5.4. Mobile app stores</h2>

      <p>
        Safe&#123;Mobile&#125; mobile apps are distributed via{' '}
        <CustomLink href="https://www.apple.com/app-store/">
          <strong>Apple AppStore</strong>
        </CustomLink>{' '}
        and{' '}
        <CustomLink href="https://play.google.com/">
          <strong>Google Play Store</strong>
        </CustomLink>
        . They most likely track user behavior when downloading apps from their stores as well as when using apps. We
        only have very limited access to that data. We can view aggregated statistics on installs and uninstalls.
        Grouping by device type, app version, language, carrier and country is possible.
      </p>

      <h2 id="fingerprinttouch-id-face-id">5.5. Fingerprint/Touch ID/ Face ID</h2>

      <p>
        We enable the user to unlock the Safe&#123;Mobile&#125; app via biometrics information (touch ID or face ID).
        This is a feature of the operating system. We do not store any of this data. Instead, the API of the operating
        system is used to validate the user input. If you have any further questions you should consult with your
        preferred mobile device provider or manufacturer.
      </p>

      <h2 id="google-firebase">5.6. Google Firebase</h2>

      <p>
        We use the following{' '}
        <CustomLink href="https://firebase.google.com/">
          <strong>Google Firebase</strong>
        </CustomLink>{' '}
        services:
      </p>

      <ul>
        <li>
          Firebase Cloud Messaging: Provide updates to the user about changes in the mobile apps via push notifications.
        </li>
        <li>
          Firebase remote config: Inform users about, recommend or force user to update their mobile app or
          enabling/disabling certain app features. These settings are global for all users, no personalization is
          happening.
        </li>
        <li>Firebase crash reporting: Report errors and crashes to improve our services and user experience.</li>
      </ul>

      <h2 id="walletconnect">5.7. WalletConnect</h2>

      <p>
        <CustomLink href="https://walletconnect.com/">
          <strong>WalletConnect</strong>
        </CustomLink>{' '}
        is used to connect wallets to dapps using end-to-end encryption by scanning a QR code. We do not store any
        information collected by WalletConnect.
      </p>

      <h2 id="sentry">5.8. Sentry</h2>

      <p>
        We use{' '}
        <CustomLink href="https://sentry.io/">
          <strong>Sentry</strong>
        </CustomLink>{' '}
        to collect error reports and crashes to improve our services and user experience.
      </p>

      <h2 id="beamer">5.9. Beamer</h2>

      <p>
        We use{' '}
        <CustomLink href="https://www.getbeamer.com/">
          <strong>Beamer</strong>
        </CustomLink>{' '}
        providing updates to the user about changes in the app. Beamer&apos;s purpose and function are further explained
        under the following link{' '}
        <CustomLink href="https://www.getbeamer.com/showcase/notification-center">
          <strong>https://www.getbeamer.com/showcase/notification-center</strong>
        </CustomLink>
        .
      </p>

      <p>We do not store any information collected by Beamer.</p>

      <h2 id="node-providers">5.10. Node providers</h2>

      <p>
        We use{' '}
        <CustomLink href="https://www.infura.io/">
          <strong>Infura</strong>
        </CustomLink>{' '}
        and{' '}
        <CustomLink href="https://nodereal.io/">
          <strong>Nodereal</strong>
        </CustomLink>{' '}
        to query public blockchain data from our backend services. All Safes are monitored, no personalization is
        happening and no user IP addresses are forwarded. Personal data processed are:
      </p>

      <ul>
        <li>your smart contract address of the Safe,</li>
        <li>transaction id/hash, and</li>
        <li>Transaction data.</li>
      </ul>

      <h2 id="tenderly">5.11. Tenderly</h2>

      <p>
        We use{' '}
        <CustomLink href="https://tenderly.co/">
          <strong>Tenderly</strong>
        </CustomLink>{' '}
        to simulate blockchain transactions before they are executed. For that we send your smart contract address of
        your Safe Account and transaction data to Tenderly.
      </p>

      <ol>
        <li>
          <p>Internal communication</p>
          <p>We use the following tools for internal communication.</p>
          <ul>
            <li>
              <CustomLink href="https://slack.com/">
                <strong>Slack</strong>
              </CustomLink>
            </li>
            <li>
              <CustomLink href="https://workspace.google.com/">
                <strong>Google Workspace</strong>
              </CustomLink>
            </li>
            <li>
              <CustomLink href="https://notion.so/">
                <strong>Notion</strong>
              </CustomLink>
            </li>
          </ul>
        </li>
      </ol>

      <h2 id="moonpay">5.12 MoonPay</h2>

      <p>
        We use MoonPay to offer on-ramp and off-ramp services. For that purpose personal data is required for KYC/AML or
        other financial regulatory requirements. This data is encrypted by MoonPay.
      </p>

      <h2 id="spindl">5.13 Spindl</h2>

      <p>
        We use{' '}
        <CustomLink href="https://www.spindl.xyz/">
          <strong>Spindl</strong>
        </CustomLink>
        , a measurement and attribution solution for web3 that assists us in comprehending how users interact with
        different decentralized applications and our Safe&#123;Mobile&#125; app and to enhance your experience with
        Safe&#123;Wallet&#125;. For enhanced privacy, data is stored for a period of 7 days after which it is securely
        deleted.
      </p>

      <h2 id="fingerprint">5.14 Fingerprint</h2>

      <p>This tool enables the processing in sections 3.5.8 and 3.5.9.</p>

      <h1 id="personal-data-transfers-to-third-countries">6. Personal data transfers to third countries</h1>

      <p>
        Wherever possible we will choose service providers based in the European Economic Area (&quot;
        <strong>EEA</strong>&quot;). However, it may also be necessary for personal data to be transferred to recipients
        located outside the EEA, <em>i.e.</em>, to third countries, such as the USA. If possible, we conclude the
        currently applicable EU standard contractual clauses of the EU Commission pursuant to GDPR Art.46.2.c with all
        processors located outside the EEA. Otherwise, we ensure that a transfer only takes place if an adequacy
        decision exists with the respective third country and the recipient is certified under this, if necessary. We
        will provide you with respective documentation on request.
      </p>

      <p>
        HOWEVER, WHEN INTERACTING WITH THE BLOCKCHAIN, AS EXPLAINED ABOVE IN THIS POLICY, THE BLOCKCHAIN IS A GLOBAL
        DECENTRALIZED PUBLIC NETWORK AND ACCORDINGLY ANY PERSONAL DATA WRITTEN ONTO THE BLOCKCHAIN MAY BE TRANSFERRED
        AND STORED ACROSS THE GLOBE.
      </p>

      <h1 id="automated-decision-makingprofiling">7. Automated decision-making/profiling</h1>

      <p>
        We do not use automatic decision-making or profiling within the meaning of GDPR Art.22.1 when processing
        personal data.
      </p>

      <h1 id="obligation-to-provide-personal-data">8. Obligation to provide personal data</h1>

      <p>
        When you visit our Websites, use our mobile applications, services or contact us you may be required to provide
        us with certain personal data as described in this Privacy Policy. Beyond that, you are under no obligation to
        provide us with personal data. However, if you do not provide us with your personal data as required, you may
        not be able to contact us and/or we may not be able to contact you to respond to your inquiries or questions.
      </p>

      <h1 id="storing-personal-data">9. Storing personal data</h1>

      <p>
        We retain your information only for as long as is necessary for the purposes for which we process the
        information as set out in this Privacy Policy.
        <br />
        However, we may retain your personal data for a longer period of time where such retention is necessary for
        compliance with a legal obligation to which we are subject, or in order to protect your vital interests or the
        vital interests of another natural person.
      </p>

      <h1 id="your-rights-as-a-data-subject">10. Your rights as a data subject</h1>

      <p>
        The following rights are available to you as a Data Subject in accordance with the provisions of the GDPR. If
        you wish to exercise your Data Subject rights, please contact us by post or at safelabs.dpo@techgdpr.com.
      </p>

      <p>
        <strong>Right of access</strong>
      </p>

      <p>
        Under the conditions of GDPR Art.15 you have the right to request confirmation from us at any time as to whether
        we are processing personal data relating to you. If this is the case, you also have the right within the scope
        of GDPR Art.15 to receive access to the personal data as well as certain other information about the personal
        data and a copy of your personal data. The restrictions of BDSG §34 apply.
      </p>

      <p>
        <strong>Right to rectification</strong>
      </p>

      <p>
        Under the conditions of GDPR Art.16 you have the right to request us to correct the personal data stored about
        you if it is inaccurate or incomplete.
      </p>

      <p>
        <strong>Right to erasure (right to be &apos;forgotten&apos;)</strong>
      </p>

      <p>
        You have the right, under the conditions of GDPR Art.17, to demand that we delete the personal data concerning
        you without delay. The restrictions of BDSG §35 apply.
      </p>

      <p>
        HOWEVER, WHEN INTERACTING WITH THE BLOCKCHAIN WE MAY NOT BE ABLE TO ENSURE THAT YOUR PERSONAL DATA IS DELETED.
        THIS IS BECAUSE THE BLOCKCHAIN IS A PUBLIC DECENTRALIZED NETWORK AND BLOCKCHAIN TECHNOLOGY DOES NOT GENERALLY
        ALLOW FOR DATA TO BE DELETED AND YOUR RIGHT TO ERASURE MAY NOT BE ABLE TO BE FULLY ENFORCED. IN THESE
        CIRCUMSTANCES WE WILL ONLY BE ABLE TO ENSURE THAT ALL PERSONAL DATA THAT IS HELD BY US IS PERMANENTLY DELETED.
      </p>

      <p>
        <strong>Right to restrict processing</strong>
      </p>

      <p>
        You have the right to request that we restrict the processing of your personal data under the conditions of GDPR
        Art.18.
      </p>

      <p>
        <strong>Right to object</strong>
      </p>

      <p>You have the right to object to the processing of your personal data under the conditions of GDPR Art.21.</p>

      <p>
        HOWEVER, WHEN INTERACTING WITH THE BLOCKCHAIN, AS IT IS A PUBLIC DECENTRALIZED NETWORK, WE WILL LIKELY NOT BE
        ABLE TO PREVENT EXTERNAL PARTIES FROM PROCESSING ANY PERSONAL DATA WHICH HAS BEEN WRITTEN ONTO THE BLOCKCHAIN.
        IN THESE CIRCUMSTANCES WE WILL USE OUR REASONABLE ENDEAVORS TO ENSURE THAT ALL PROCESSING OF PERSONAL DATA HELD
        BY US IS RESTRICTED, NOTWITHSTANDING THIS, YOUR RIGHT TO RESTRICT TO PROCESSING MAY NOT BE ABLE TO BE FULLY
        ENFORCED.
      </p>

      <p>
        <strong>Right to data portability</strong>
      </p>

      <p>
        You have the right, under the conditions of GDPR Art.20, to request that we hand over, in a structured, common
        and machine-readable format, the personal data concerning you that you have provided to us. Please note that
        this right only applies where the processing is based on your consent, or a contract and the processing is
        carried out by automated means.
      </p>

      <p>
        <strong>Right to object to direct marketing (&apos;opting out&apos;)</strong>
      </p>

      <p>
        You have a choice about whether or not you wish to receive information from us. We will not contact you for
        marketing purposes unless:
      </p>

      <ul>
        <li>
          you have a business relationship with us, and we rely on our legitimate interests as the lawful basis for
          processing (as described above)
        </li>
        <li>you have otherwise given your prior consent (such as when you download one of our guides)</li>
      </ul>

      <p>
        You can change your marketing preferences at any time by contacting us on the above details. On each and every
        marketing communication, we will always provide the option for you to exercise your right to object to the
        processing of your personal data for marketing purposes (known as &apos;opting-out&apos;) by clicking on the
        &apos;unsubscribe&apos; button on our marketing emails or choosing a similar opt-out option on any forms we use
        to collect your data. You may also opt-out at any time by contacting us on the below details.
      </p>

      <p>
        Please note that any administrative or service-related communications (to offer our services, or notify you of
        an update to this Privacy Policy or applicable terms of business, etc.) will solely be directed at our clients
        or business partners, and such communications generally do not offer an option to unsubscribe as they are
        necessary to provide the services requested. Therefore, please be aware that your ability to opt-out from
        receiving marketing and promotional materials does not change our right to contact you regarding your use of our
        website or as part of a contractual relationship we may have with you.
      </p>

      <p>
        <strong>Right of revocation</strong>
      </p>

      <p>
        You may revoke your consent to the processing of your personal data at any time pursuant to GDPR Art.7.3. Please
        note, that the revocation is only effective for the future. Processing that took place before the revocation
        remains unaffected.
      </p>

      <p>
        <strong>Right to complain to a supervisory authority</strong>
      </p>

      <p>
        Subject to the requirements of GDPR Art.77, you have the right to file a complaint with a competent supervisory
        authority. As a rule, the data subject may contact the supervisory authority of his or her habitual residence or
        place of work or place of the alleged infringement or the registered office of Safe Labs. The supervisory
        authority responsible for Safe Labs is the Berliner Beauftragte für Datenschutz und Informationsfreiheit. A list
        of all German supervisory authorities and their contact details can be found{' '}
        <CustomLink href="https://www.bfdi.bund.de/EN/Service/Anschriften/Laender/Laender-node.html">here</CustomLink>.
      </p>

      <h1 id="changes-to-this-privacy-policy">11. Changes to this Privacy Policy</h1>

      <p>
        We may modify this Privacy Policy at any time to comply with legal requirements as well as developments within
        our organization. When we do, we will revise the date at the top of this page. We encourage you to regularly
        review our Privacy Policy to stay informed about our Privacy Policy. The current version of the privacy notice
        can be accessed at any time at https://app.safe.global/privacy.
      </p>

      <h1 id="contact-us">12. Contact us</h1>

      <p>Contact us by post or e-mail at:</p>

      <p>
        Safe Labs GmbH
        <br />
        Unter den Linden 10
        <br />
        10117 Berlin
        <br />
        Germany
        <br />
        <CustomLink href="mailto:privacy@safe.global">privacy@safe.global</CustomLink>
      </p>

      <p>&nbsp;</p>

      <p>Contact our Data Protection Officer by post or e-mail at:</p>

      <p>
        <em>TechGDPR DPC GmbH</em>
        <br />
        <em>Willy-Brandt-Platz 2</em>
        <br />
        <em>12529 Berlin-Schönefeld</em>
        <br />
        <em>Germany</em>
        <br />
        <CustomLink href="mailto:safelabs.dpo@techgdpr.com">safelabs.dpo@techgdpr.com</CustomLink>
      </p>

      <p>***</p>
    </>
  )
}

export default PrivacyPolicy
