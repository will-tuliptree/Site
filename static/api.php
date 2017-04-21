<?PHP
header('Content-Type: application/xml');
echo '
<quote>
    <result tc="5">Success</result>
    <quoteData>
        <product>TERM</product>
        <termLength>30</termLength>
        <state>PA</state>
        <age>32</age>
        <gender>F</gender>
        <faceAmount>184000</faceAmount>
        <riskClass>PFD</riskClass>
    </quoteData>
    <quotedAge>32</quotedAge>
    <quotedPremiums>
        <quotedPremium riskClass="PFD" tobacco="N" quoteId="3989197da893429586654c8ca51cda93">
            <quotedRiskClass>Preferred Non-Tobacco</quotedRiskClass>
            <faceAmount>184000</faceAmount>
            <monthlyPremium>15.64</monthlyPremium>
            <quarterlyPremium>46.92</quarterlyPremium>
            <semiannualPremium>93.84</semiannualPremium>
            <annualPremium>187.68</annualPremium>
        </quotedPremium>
        <quotedPremium riskClass="PFD" tobacco="Y" quoteId="f1582b7ec47947edbbe7394291ee1d82">
            <quotedRiskClass>Preferred Tobacco</quotedRiskClass>
            <faceAmount>184000</faceAmount>
            <monthlyPremium>43.55</monthlyPremium>
            <quarterlyPremium>130.64</quarterlyPremium>
            <semiannualPremium>261.28</semiannualPremium>
            <annualPremium>522.56</annualPremium>
        </quotedPremium>
    </quotedPremiums>
</quote>
';
?>
